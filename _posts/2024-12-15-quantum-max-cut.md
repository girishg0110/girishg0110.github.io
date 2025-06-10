---
layout: distill
title: graph problems and quantum estimation
description: applying qaoa to solve the max-cut problem
tags: quantum-computing graph
giscus_comments: false
date: 2024-12-15
featured: false
mermaid:
  enabled: true
  zoomable: true
code_diff: true
map: true
chart:
  chartjs: true
  echarts: true
  vega_lite: true
tikzjax: true
typograms: true

authors:
  - name: Girish Ganesan
    affiliations: 
      name: Rutgers University

bibliography: 2024-12-15-quantum-max-cut.bib

toc:
  - name: Abstract
  - name: Overview
  - name: Derivation
  - name: Implementation
  - name: Conclusions and Connections
  - name: References

---

## Abstract
Quantum approximate optimization algorithms (QAOA) are a class of quantum algorithms applicable to combinatorial optimization problems. In this paper, I present a general overview of the process of adapting a problem to a QAOA-based approach. Then, I apply QAOA to the Max-Cut Problem for unweighted graphs, showing the process of developing the appropriate circuit in Qiskit and assessing the validity of my measurements.

## Overview
Currently, the quantum computers in development are extremely limited in their capabilities. A number of engineering challenges have limited progress in building quantum computers suitable for running the most important and promising applications physicists have envisioned. The implementation of Shor's algorithm for factorization of large primes and efficient quantum chemistry simulations both rely on large numbers of qubits, each of which needs to be error-checked and kept in the strictest isolation possible for the duration of the computation. \\ \\
In contrast, QAOA is an application that is low-cost in the number of qubits, can achieve state-of-the-art performance on par or exceeding that of classical computers, and is achieved through interfacing with classical computation, removing the need for excessive fault tolerance. We set up the combinatorial optimization scenario as follows. A discrete variable $x$ can assume values in the domain $S$ and is equipped with a cost function $C(x):S\to \mathbb{R}$ that we wish to maximize. The QAOA approach is to develop an "ansatz", or a parametrized circuit architecture, informed by the nature of the problem. We then shift focus to find the optimal parameters such that when the state $\ket{x}$ is prepared as input, the circuit returns the state $\ket{C(x)}$ as measured output. This optimization process is iterative, with each run of the algorithm getting closer to the true result.

### Literature Review
QAOA was originally propsed in the paper "A Quantum Approximate Optimization Algorithm" by Farhi et al (2014)$^1$. To bolster the case in favor of using QAOA as a practical, robust approach to solve combinatorial optimization problems, the authors present two notable arguments. The first lies in their investigation of $k$-regular graphs. A $k$-regular graph is one in which every vertex has exactly $k$ neighbors. By classifying all types of 3-regular graphs, they present a convincing argument that the approximation ratio of a QAOA Max-Cut circuit has a worst-case value of 0.6924. The approximation ratio for some possible partition of the graph (in the Max-Cut setting) is the value of the cut indicated by the partition divided by the optimal value of the objective, i.e. the maximal cut possible. Worst-case ratios are also provided for special kinds of $n$-regular graphs for $n>3$ from a rigorous mathematical standpoint, adding credibility to the capacity of QAOA to solve NP-hard problems in average-case polynomial time.\\ \\ 
Moreover, they analogize the QAOA parameter optimization process to adiabatic evolution. The quantum adiabatic algorithm involves finding a high-energy eigenstate of some Hamiltonian by simulating a different time-dependent Hamiltonian on a quantum computer$^2$. This algorithm dates back to 2000 and was discovered by the same author; framing QAOA as a continuation (and in many ways, an improvement) of that work builds confidence that QAOA and other approximate optimization techniques may be the first sign of quantum supremacy in the "noisy intermediate-scale quantum" (NISQ) era.


## Derivation
The max-cut problem for unweighted, undirected graphs can be stated as follows: color the nodes of graph $G$ with two colors such that the number of edges connecting nodes of different colors is maximized. For the graph shown below, the partition $\{0, 1\}, \{2, 3\}$ yields a cut value of 2, while the partition $\{0, 3\}, \{1, 2\}$ yields a cut value of 3 which is maximal.
\begin{figure}[h]
    \centering
    \includegraphics[scale=0.5]{k4.PNG}
\end{figure}
The procedure of partitioning the node set of the graph into two disjoint sets can be numerically representing as assigning $s_i\in\{-1, +1\}$ for each node in the graph. Then, summing over all edges in the graph (and accounting for double counting the same edge), the cut value relating to any given partition of $G$ is \[\frac{1}{2}\sum_{(u,v)\in G}{(1-s_us_v)}\].

### Finding the Hamiltonian
To translate this problem into the language of the quantum computer, we need to envelop this information into a Hamiltonian matrix $C$, such that 
\[C\ket{x}=C(x)\ket{x}\]
We first observe that the Pauli-Z matrix has eigenvalues $+1$ and $-1$ by inspection, with z-basis vectors as its eigenstates. Then, define $C:=\frac{1}{2}\sum_{(u,v)\in G}{(1-Z_uZ_v)}$ where $Z_k$ is a Pauli-Z gate operating on the k-th qubit of the input state. This matrix $C$ has the desired property. 
\[C\ket{x}=C\ket{x_0x_1...x_n}\forall x_i\in \{0,1\}\]
\[=\frac{1}{2}\sum_{(u,v)\in G}{(1-Z_uZ_v)}\ket{x_0x_1...x_n}\]
\[=\frac{1}{2}\sum_{(u,v)\in G}\ket{x_0x_1...x_n}-\ket{x_0x_1...}(Z_u)\ket{x_u}\ket{x_{u+1}...x_{v-1}}(Z_v)\ket{x_v}\ket{...x_n}\]
\[=\frac{1}{2}\sum_{(u,v)\in G}\ket{x_0x_1...x_n}-(-1)^{x_u}(-1)^{x_v}\ket{x_0x_1...x_n}\]
\[=(\frac{1}{2}\sum_{(u,v)\in G}(1-(-1)^{x_u}(-1)^{x_v}))\ket{x_0x_1...x_n}=C(x)\ket{x}\]
Note that in the final step, any term of the summation yields 0 if and only if $x_u= x_v$ and 1 if and only if $x_u\neq x_v$. Since this Hamiltonian represents the cost function, it is referred to as the cost Hamiltonian. We also define a mixer Hamiltonian $M$, which will serve as an additional layer in the final quantum circuit that separates each sequence of cost Hamiltonian gates, as the sum of Pauli-X gates on each qubit:
\[M=\sum_{i}^{n}X_i\]
Note that for a graph with $|G|=n$ vertices, each of these matrices is $2^n\cross 2^n$ in dimensions. By describing them by summation, we avoid having to explicitly compute any elements of these matrices in the upcoming steps.

### Preparing the Ansatz
With these two Hamiltonians in hand, we can now proceed to the construction of the ansatz circuit for the Max-Cut QAOA problem. An "ansatz" is a general structure defined for a circuit. Some of the gates will be parameterized, and over the course of the optimization process we will find the best parameters for this ansatz to obtain near-optimal results. \\ \\ 
The QAOA setup requires us to apply alternating layers of unitary operators on the input state, which is an equal superposition. In other words, the state at the end of the circuit's run should be
\[=e^{-i\beta_pM}e^{-i\alpha_pC}...e^{-i\beta_1M}e^{-i\alpha_1C}H^{\otimes n}\ket{0}\]
Here, the variable $p$ simply represents the number of repeated layers of cost and mixer gates that the ansatz contains. This is determined in the selection of the ansatz at the very start and not changed during the run. Increasing $p$ generally adds more power and expressivity to the circuit, at the cost of an increased runtime and a potentially prohibitive increase in cumulative error due to the increased number of fault-prone gates. \\ \\ 
Let us first examine the expressions of the form $e^{-i\alpha M}$. Substituting in our explicit definition for $M$, 
\[e^{-i\alpha M}=e^{-i\alpha \sum_{j=1}^n X_j}\]
\[=e^{-i\alpha X_1} e^{-i\alpha X_2} ... e^{-i\alpha X_n}\]
\[=\Pi_{j=1}^n e^{-i\alpha X_j}\]
Then, this part of the ansatz corresponds to a series of qubit-by-qubit rotations of angle $2\alpha$ in the x-basis. A more complicated situation arose with operators of the form $e^{-i\beta C}$. Note first that for the purposes of maximization, the coefficients on the summation and constants inside are irrelevant. Then, we can express the objective $\frac{1}{2}\sum_{(u, v)\in G}1-Z_uZ_v$ more succinctly as $C=\sum_{(u, v)\in G} -Z_uZ_v$. It should be evident that maximizing the action of the first Hamiltonian on the equal superposition state maximizes the second as well. Then, we can explore how the operator $e^{-i\beta C}$ acts on the four two-qubit states $x_u$ and $x_v$ could possibly be in.
\[e^{-i\beta C}\ket{00} = e^{i\beta Z_u\otimes Z_v}\ket{00} = e^{i\beta}\ket{00}\]
\[e^{-i\beta C}\ket{01} = e^{i\beta Z_u\otimes Z_v}\ket{01} = e^{-i\beta}\ket{01}\]
\[e^{-i\beta C}\ket{10} = e^{i\beta Z_u\otimes Z_v}\ket{10} = e^{-i\beta}\ket{10}\]
\[e^{-i\beta C}\ket{11} = e^{i\beta Z_u\otimes Z_v}\ket{11} = e^{i\beta}\ket{11}\]
Then, the action of operator $e^{-i\beta C}$ on state $\ket{x_ux_v}$ for $x_u, x_v\in \{0,1\}$ is \[e^{i(-1)^{x_u\oplus x_v} \beta}\ket{x_ux_v}\]
The state remains the same albeit with a phase shift dependent on the two qubit values; if $x_u=x_v$, the phase shift is $e^{i\beta}$, else it is $e^{-i\beta}$. The sequence of gates that achieves this result is $CNOT(u\to v)\otimes R_z(2\beta) \otimes CNOT(u\to v)$, where the $R_z$ gate represents a rotation by the specified angle in the z-basis.

## Implementation
My full code is available here:\\ https://colab.research.google.com/drive/1Bn\_XCxoIdZVLRiPU\_MsHozQikNMNS\_4k?usp=sharing \\
Outputs have been saved for easy viewing but the notebook is no longer linked to my IBM account. \\ \\  
The method \textsc{get\_maxcut\_ansatz} returns a QuantumCircuit parameterized by the values passed into it. The value of $p$ is inferred from the number of angle parameters provided. \\
\begin{figure}[h]
    \centering
    \includegraphics[scale=0.5]{get-maxcut-ansatz.PNG}
\end{figure}

In the first step, a Hadamard transform is applied to the input qubits in the $\ket{00...0}$ state, placing them into an equal superposition. Next, $p$ layers of the alternating CNOT-RZ-CNOT and RX gates are added. Finally, all qubits are measured and the observed values are stored in classical registers.\\ \\ 
For a graph with 5 vertices and $p=1$, the ansatz looks like so.

\begin{figure}[h]
    \centering
    \includegraphics[scale=0.5]{p1circuit.PNG}
\end{figure}

Note the cascade of CNOT-RZ-CNOT units, followed by a string of RX rotations on each wire. At the end, all qubits are measured. In contrast, consider this circuit for $p=2$. 

\begin{figure}[h]
    \centering
    \includegraphics[scale=0.5]{p2ansatz.PNG}
\end{figure}

As expected, it has two layers of alternating cost and mixer gates. Note that the parameter values for the RZ gates differ across layers. The same applies for the RX gates. \\ \\
The iterative workflow of the program was to first make measurements using the default trial parameter values assigned to the ansatz. Each set of $n$ measurements was interpreted as a partition of the node set into two groups, and the cut value of this partition was calculated. Over a large number of shots, this process was repeated until all shots were exhausted, when the cost function returns the "expected cut value" produced by running the quantum circuit to find an adequate partition. This was all packaged into a function that represented a mapping of $2p$ parameters to a scalar value (expected cut value) and fed into the Scipy \textsc{minimize} utility. 

\begin{figure}[h]
    \centering
    \includegraphics[scale=0.6]{optimize-maxcut.PNG}
\end{figure}

The \textsc{optimize\_maxcut} function is responsible for encapsulating this optimization routine. It uses the COBYLA algorithm, the default suggested by Scipy. Note that this method returns three pieces of information: the best partition found, the cut value of that partition, and the full frequency distribution of each outcome for further analysis and visualization.\\ \\ 
Methods to create random graphs and calculate maximum cuts by brute force (iterating over all possible partitions) are also included for testing and debugging purposes.

### Experimental Results
Two example graphs are experimented with at the end of the Jupyter notebook. 
\begin{figure}[h]
    \centering
    \begin{subfigure}
        \centering
        \includegraphics[width=.4\linewidth, scale=0.5]{g1.png}
        G1
    \end{subfigure}
    \begin{subfigure}
        \centering
        \includegraphics[width=.4\linewidth, scale=0.5]{g2.png}
        G2
    \end{subfigure}
\end{figure}
\\Max-cut QAOA is run for two settings of $p$ ($p=1$ and $p=2$) and on the QASM simulator or a real IBM quantum computer. Thus, there are eight total computations present in the notebook. In the table below, approximation ratios for all eight trials are presented (note that if the ratio is 1, then the optimal cut was found).
\begin{figure}[h]
    \centering
    \includegraphics[scale=0.7]{approximation_ratios.PNG}
\end{figure}
\\As a sanity check, we apply the \textsc{draw\_maxcut\_result} function on these graphs to show their partitions. The top four correspond to G1 and the bottom four to G2. All partitions match their calculated cut values.
\pagebreak

\begin{figure}[h]
    \centering
    \includegraphics[scale=0.6]{maxcut-viz.PNG}
    \caption*{Visualizations of graph partitions for G1 and G2}
\end{figure}

## Conclusions and Connections
One trend I noticed was that QASM simulations performed definitively better than real quantum computers in approximating the max-cut solution on either graph. Holding the $p$ value constant and comparing results for the same graph shows that running the circuit on IBM's quantum computers always does worse than the simulated answer. This is unsurprising. The QASM simulator is by definition error-free, since it does not truly manipulate qubits to achieve its computations. Rather, it simulates quantum behavior in a deterministic manner, with classical registers describing the state of the $n$-qubit system exactly. On the other hand, IBM's remote machine are prone to noise and have imperfect error mitigation, resulting in more overall noise in the data. This in turn reduces the prevalence of the correct partition occurring in the data. \\ \\ 
Looking closely at the QASM result, it is clear that increasing the value of $p$ yields better results. This is again unsurprising, because the ansatz with more layers has more degrees of freedom to model the desired behavior. With QASM, there are no drawbacks to using one or two more layers, barring a slight increase in overall run-time; however, when running the circuits on IBM's quantum computers, increased depth is correlated with increased error, which is unacceptable given the relatively poor performance of the real machines on even $p=1$ architectures. \\ \\
Moreover, I think results would be improved if a better algorithm was chosen for the optimization routine. COBYLA is a general purpose, conventional optimization algorithm that is unaware of the innate randomness in quantum simulation results. When a measurement is made at the end of one of the circuit's runs during the optimization routine, there is a chance that the wrong state is measured, especially with the introduction of small phase errors in real quantum computers. These small errors may manifest themselves in the ultimate measurement, and COBYLA will take these results at face value. If we were able to incorporate some quantum understanding into COBYLA, providing it with the udnerstanding that not all measurements are 100\% accurate, it may help the optimization converge faster and more accurately than it currently does.\\ \\ 
Given more time, I might wish to implement some of the more recent research into QAOA that has occurred in the last decade to improve my results. In a paper by Shaydulin et al (2021)$^4$, the authors present a methodology for exploiting the inherent symmetry of some problems in order to acheive faster run-times. Since the main bottleneck in the QAOA variational cycle is on the quantum side rather than the classical side, this would be a major improvement and would allow me to experiment with larger, denser graphs. In another paper by Marwaha (2021)$^3$, it is suggested that there may not be the trivial linear increase in modeling capability that I presented as fact earlier in the paper when we increase $p$. Indeed, it appears that for some graphs, the max-cut ansatz works better with fewer layers. This would be another matter of great interest to investigate further.

## References
\begin{enumerate}
    \item Farhi et al, "A Quantum Approximate Optimization Algorithm". arXiv:1411.4028
    \item Farhi et al, "Quantum Computation by Adiabatic Evolution". arXiv:quant-ph/0001106
    \item Marwaha, "Local classical MAX-CUT algorithm outperforms p=2 QAOA on high-girth regular graphs". arXiv:2101.05513
    \item Shaydulin et al, "Exploiting Symmetry Reduces the Cost of Training QAOA". arXiv:2101.10296
\end{enumerate}