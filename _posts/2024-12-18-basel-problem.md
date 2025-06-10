---
layout: distill
title: a basel problem redux
description: approaches from analysis and geometry to summing squared reciprocals
tags: infinite-series taylor-series
giscus_comments: false
date: 2024-12-18
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
amsmath: true

authors:
  - name: Girish Ganesan
    affiliations: 
      name: Rutgers University

bibliography: 2024-12-18-basel-problem.bib

toc:
  - name: A Brief History
  - name: By the Taylor Series for arcsin(x)
  - name: By Trigonometry and Euler's Formula
  - name: By a Double Integral
  - name: An Application in Probability
  - name: Bibliography

---


## A Brief History

In 1650, Pietro Mengoli published a paper titled "Novae quadraturae arithmeticae seu de additione fractionum" (loosely translated as "New arithmetic calculations of the sums of fractions") in which he examined several series that intrigued his mathematical contemporaries. Among his results were that the harmonic series, defined as the sum of the reciprocals of the natural numbers, was divergent; that the alternating harmonic series converged to $\ln{2}$; and that the Wallis product converged to $\pi$. However, one problem that stumped even him was to calculate the value of the following series:

$\begin{align}\sum_{n=1}^\infty \frac{1}{n^2}\end{align}$

For the next century, an increasing number of mathematical pioneers grew increasingly frustrated at the seeming intractability of this very natural generalization of the harmonic series. They could prove, as Jakob Bernoulli did, that this series converged by comparison to other well-known series, but the exact value was unknown. Worse still, the series was found to converge at a tedious pace, so guessing the closed form solution from approximations was out of the question.

Just when it seemed that no mathematician (and no mathematical tools) were up to the task of calculating the value of this series exactly, Leonhard Euler published a most unusual result in 1735:
$\begin{align}\sum_{n=1}^\infty \frac{1}{n^2}=1+\frac{1}{2^2}+\frac{1}{3^2}+\frac{1}{4^2}...=\frac{\pi^2}{6}\end{align}$

While his methods are considered dubious by modern standards, his end result appeared sound: more efficient approximations of the Basel series that Euler himself introduced showed that the true value was exceedingly closed to refined experimental evidence. Indeed, he was right, and his manipulations of infinite polynomials as if they were finite were later shown to be mathematically valid.

Since then, mathematicians have both polished up Euler's own original proof and constructed ingenious solutions of their own to the same problem, drawing on disparate fields of study like analysis, geometry, and probability. I will show three such proofs in this paper, all leading to the same remarkable result.

## By the Taylor Series for arcsin(x)
In this section, we will solve exercises from section 8.3 of Abbott's Understanding Analysis following a proof by Boo Rim Choe refined by Peter Duren.

### Exercise 8.3.3
Our motivation in this exercise is to derive a closed-form solution for one class of the so-called Wallis integrals, a formula that will prove helpful in the final stages of this proof.

Let $b_n=\int_{x=0}^{\pi/2} \sin^{n}(x) dx$ and assume $n\geq 2$. Note that $\sin^{n}(x)=\sin^{n-1}(x)\cdot \sin(x)$, so we can do integration by parts with $u=\sin^{n-1}(x)$ and $dv=\sin(x)dx$.

$\begin{align}b_{n}=[-\sin^{n-1}(x)\cos(x)]^{\pi/2}_0+\int_0^{\pi/2}(n-1)\sin^{n-2}(x)\cos^2(x)dx\end{align}$

At $x=0$, $\sin(x)=0$. At $x=\pi/2$, $\cos(x)=0$. Then, this first term is 0. As for the second integral, we can rewrite $\cos^2(x)$ as $1-\sin^2{x}$ according to familiar Pythagorean identities.

$\begin{align}=(n-1)\int_0^{\pi/2} \sin^{n-2}(x)(1-\sin^2(x)) dx\end{align}$
$\begin{align}=(n-1)[\int_0^{\pi/2} \sin^{n-2}(x) - \sin^{n-2}(x)\sin^2(x) dx]\end{align}$
$\begin{align}=(n-1)[\int_0^{\pi/2} \sin^{n-2}(x) dx - \int_0^{\pi/2} \sin^{n}(x) dx]\end{align}$

Observe that these two integrals are also Wallis integrals! Then, some algebra follows and we arrive at the following recurrence relation:

$\begin{align}b_n=(n-1)[b_{n}+b_{n-2}] \implies b_n=\frac{n-1}{n}(b_{n-2})\end{align}$

Wallis integrals behave differently for even and odd $n$. For our proof, we need to investigate Wallis integrals of odd $n$. Let $n=2k+1$ for non-negative integers $k$. The base case is easily solved, as $b_1=\int_0^{\pi/2}\sin(x) dx=[\cos(x)]_0^{\pi/2}=1$. The explicit formula for $b_{2k+1}$ is then

$\begin{align}\Pi_{i=0}^k \frac{2i}{2i+1}=\frac{2^k\cdot k!}{\Pi_{i=0}^k {2i+1}} = \frac{2^k\cdot k!}{1\cdot 3\cdot 5...\cdot (2k+1)}\end{align}$
$\begin{align}=\frac{2^k\cdot k!}{\frac{(2k+1)!}{2\cdot 4\cdot 6... \cdot (2k)}}=\frac{2^k\cdot k!}{\frac{(2k+1)!}{2^k \cdot k!}}=\frac{2^{2k}(k!)^2}{(2k+1)!}\end{align}$

### Exercise 8.3.6
Recall that this proof will arrive at the solution to the Basel problem through a Taylor representation of the $\arcsin{x}$ function. While the $\arcsin{x}$ function itself maybe be a bit unwieldy, it has a very simple derivative: $\frac{1}{\sqrt{1-x^2}}$. Then, the idea is to find a Taylor series for an even simpler expression $\frac{1}{\sqrt{1-x}}$, to substitute $x\to x^2$, and finally to term-wise integrate (with some justification) to find a Taylor series for $\arcsin{x}$ itself.

To find the Taylor series expansion of $(1-x)^{-\frac{1}{2}}$, we can use the Taylor coefficient formula: $c_n=\frac{f^{(n)}(0)}{n!}$.

$\begin{align}c_0=1\end{align}$
$\begin{align}c_1=\frac{f^{(1)}(0)}{1!}=\frac{\frac{1}{2}(1-0)^{-\frac{3}{2}}}{1!}=\frac{1}{2}\end{align}$
$\begin{align}c_2=\frac{f^{(2)}(0)}{2!}=\frac{\frac{1}{2}\cdot \frac{3}{2}(1-0)^{-\frac{5}{2}}}{2!}=\frac{1\cdot 3}{2^2\cdot 2!}\end{align}$
$\begin{align}c_3=\frac{f^{(3)}(0)}{3!}=\frac{\frac{1}{2}\cdot \frac{3}{2}\frac{5}{2}(1-0)^{-\frac{7}{2}}}{3!}=\frac{1\cdot 3\cdot 5}{2^3\cdot 3!}\end{align}$
$\begin{align}c_n=\frac{f^{(n)}(0)}{n!}=\frac{\frac{1}{2}\cdot \frac{3}{2}\frac{5}{2}...\frac{2n-1}{2}}{n!}=\frac{1\cdot 3\cdot 5\cdot ... \cdot 2n-1}{2^n\cdot n!}\end{align}$

Rewriting the denominator yields $c_n=\frac{\Pi_{i=1}^n 2i-1}{\Pi_{i=1}^n 2i}$ for $n>0$. Using the standard techniques mentioned earlier in this section for rewriting products of this form, $c_n=\frac{(2n)!}{2^{2n}(n!)^2}$ for $n>0$.

### Exercise 8.3.7a
In this exercise, our interest in is proving that $\lim_{n\to \infty} c_n$ as defined before will be equal to 0. This will be helpful when proving that the error function of a certain Taylor expansion approaches 0. A useful result is provided to us in Abbott and stated here without proof:

$\begin{align}\lim_{n\to \infty} \frac{1}{c_n\sqrt{n}} = \sqrt{\pi}\end{align}$

Suppose $\lim c_n\neq 0$. Then, by the Algebraic Limit Theorem, 

$\begin{align}\lim_{n\to \infty} \frac{1}{c_n\sqrt{n}} = \lim_{n\to \infty} \frac{\frac{1}{\sqrt{n}}}{c_n} = \frac{ \lim_{n\to \infty} \frac{1}{\sqrt{n}} }{ \lim_{n\to \infty} c_n }\end{align}$

The limit in the numerator is clearly 0, and the limit in the denominator is non-zero. Then, this quotient (and the original limit we were examining) is equal to 0. But we know that $\lim_{n\to \infty} \frac{1}{c_n\sqrt{n}} = \sqrt{\pi}\neq 0$. This is a contradiction. Then, $\lim_{n\to \infty} c_n = 0$.

### Exercise 8.3.9ab
Now, we need to prove that this Taylor series expansion for $\frac{1}{\sqrt{1-x}}$ converges for $|x|<1$. However, we will need to introduce a new tool to estimate the error function $E_N(x)$, something better than the Lagrange error bound. We prove the bound suggested by the Integral Remainder Theorem:

$\begin{align}E_N(x)=\frac{1}{N!}\int_0^x f^{N+1}(t)(x-t)^N dt\end{align}$

 - We can rewrite the integral $\int_{0}^x f'(t) dt$ as $f(x)-f(0)$ by the Fundamental Theorem of Calculus. Rearranging yields $f(x)=f(0)+\int_{0}^x f'(t)$. This is the first iteration of the Integral Remainder Theorem.
 - Next, we apply integration by parts to the integral $\int_{0}^x f'(x) dt$ in the previous problem to obtain a second iteration, where the error is a function of the second derivative.
    $\begin{align}\int_{0}^x f'(t) dt=f'(x)(x-x)+f'(0)(x-0)+\int_{0}^x f"(t)(x-t) dt\end{align}$
    $\begin{align}=xf'(0)+\int_{0}^x f"(t)(x-t) dt\end{align}$
    Substituting this expression into the expression from part A of this problem yields the following, as desired:
    $\begin{align}f(x)=f(0)+f'(0)x+\int_{0}^x f"(t)(x-t) dt\end{align}$
 - A general pattern is observed about the results of this iterative integration-by-parts. Based on this observation, we consider the general case of integrating $\int_0^x f^{(n)}(t) \frac{(x-t)^{n-1}}{(n-1)!}dt$ by parts.
    $\begin{align}\int_0^x f^{(n)}(t) \frac{(x-t)^{n-1}}{(n-1)!}dt=f^{(n)}(t)\frac{(x-t)^{n}}{n}\frac{1}{(n-1)!}+\int_0^x f^{(n+1)}(t) \frac{(x-t)^n}{n!} dt\end{align}$
    $\begin{align}=f^{(n)}(t)\frac{(x-t)^{n}}{n!}+\int_0^x f^{(n+1)}(t) \frac{(x-t)^n}{n!} dt\end{align}$
    As expected, a integral bound involving $f^{(n)}$ is broken into a term outside an integral and an integral bound involving $f^{(n+1)}$, in the form expected by the Integral Remainder Theorem. This process can be repeated how many ever times $f$ is differentiable (which agrees with what is stated in Abbott).

### Exercise 8.3.10d
With this new tool for estimating the error of a Taylor polynomial, we show that the Taylor series for $\frac{1}{\sqrt{1-x}}$ converges on $(-1,1)$.\\
First, we use the specific case of $f(x)=\frac{1}{\sqrt{1-x}}$ to derive an explicit formulation of the Integral Remainder Theorem error $E_N=\frac{1}{N!}\int_0^x f^{(N+1)}(t)(x-t)^N dt$. In particular, we can rewrite $f^{(N+1)}(t)$. 

$\begin{align}f^1(t)=\frac{1}{2}(1-t)^{-\frac{1}{2}-1}\end{align}$
$\begin{align}f^2(t)=\frac{1}{2}\frac{3}{2}(1-t)^{-\frac{1}{2}-2}\end{align}$
$\begin{align}f^{N+1}(t)=(\frac{1}{2}\frac{3}{2}...\frac{2(N+1)-1}{2})(1-t)^{-\frac{1}{2}-N-1}\end{align}$
$\begin{align}=(1-t)^{-\frac{3}{2}}(1-t)^{-N}\Pi_{i=0}^N \frac{2i+1}{2}\end{align}$
$\begin{align}=(1-t)^{-\frac{3}{2}}(1-t)^{-N}\frac{1\cdot 3\cdot ... \cdot (2N+1)}{2^{N+1}}\end{align}$
$\begin{align}=(1-t)^{-\frac{3}{2}}(1-t)^{-N}\frac{\frac{(2N+1)!}{2^{N}N!}}{2^{N+1}}
=(1-t)^{-\frac{3}{2}}(1-t)^{-N}\frac{(2N+1)!}{2^{2N+1}N!}\end{align}$
Now, we can substitute this expression into the formula for $E_N$.
$\begin{align}E_N=\frac{1}{N!}\int_0^x (1-t)^{-\frac{3}{2}}(1-t)^{-N}\frac{(2N+1)!}{2^{2N+1}N!}(x-t)^N dt\end{align}$
Taking constant terms out of the integral and rearranging terms gives us a clearer sense of what is happening.
$\begin{align}E_N=\frac{(2N+1)!}{2^{2N+1}(N!)^2}\int_0^x (1-t)^{-\frac{3}{2}}(\frac{x-t}{1-t})^N dt\end{align}$
If we could reduce the dependence of the integrand on $t$, i.e. by bounding the expression $\frac{x-t}{1-t}$ with a function of $x$, the integral is trivial to compute. Recall that we are working under the assumption that $|x|<1$. Let us first consider the case of $0\leq x\leq 1$. Then, $0\leq t\leq x$. Then, $0\leq xt\leq t$. Focusing on the second part of this inequality, we can multiply both sides by $-1$ and add $x$: $x-xt\geq x-t$. Both expressions are positive, so we can take the absolute value of both sides and divide through to obtain $|x|\geq |\frac{x-t}{1-t}|$. The case of $-1\leq x\leq 0$ is analogous. \\
Then, we can upper bound $E_N$ by

$\begin{align}E_N\leq \frac{(2N+1)!}{2^{2N+1}(N!)^2}|x|^N\int_0^x (1-t)^{-\frac{3}{2}} dt\end{align}$

The integral can now be manually computed as $\int_0^x (1-t)^{-\frac{3}{2}} dt=2(1-x)^{-\frac{1}{2}}-2$. Then, 

$\begin{align}E_N\leq \frac{(2N+1)!}{2^{2N}(N!)^2}|x|^N(\frac{1}{\sqrt{1-x}}-1)=(2N+1)\cdot c_{N}\cdot |x|^N\cdot (\frac{1}{\sqrt{1-x}}-1)\end{align}$

For any chosen $x\in(-1,1)$, $\frac{1}{\sqrt{1-x}}-1$ is a constant factor. We know that $\lim_{n\to \infty} c_n = 0$ from our work on Exercise 8.3.7a. All that remains to show is that $\lim_{N\to \infty} (2N+1)|x|^N = 0$, and this is evident because the $|x|^N$ decays exponentially towards 0 while the $2N+1$ term only grows linearly. Then, $\lim_{N\to \infty} E_N = 0$, which implies that our Taylor series representation for $\frac{1}{\sqrt{1-x}}$ converges uniformly for all $|x|<1$.

### Exercise 8.3.11
Now, we can substitute $x\to x^2$ into our Taylor series for $\frac{1}{\sqrt{1-x}}$ to obtain the following series, defined for $|x|<1$:

$\begin{align}\frac{1}{\sqrt{1-x^2}} = \sum_{n=0}^\infty c_n x^{2n}\end{align}$

Everything is in place for us to find the Taylor series for $\arcsin{x}$. We know that $\sum_{n=0}^\infty c_n x^{2n}$ converges uniformly for $x\in(-1,1)$ and that $\arcsin{x} = \int_0^x \frac{1}{\sqrt{1-x^2}} dx$. Then,

$\begin{align}\arcsin{x}=\int_0^x \sum_{n=0}^\infty c_n x^{2n} dx\end{align}$

Since the inner series is uniformly convergent, we can bring the integral into the sum like so by the Integrable Limit Theorem:

$\begin{align}=\sum_{n=0}^\infty \int_0^x c_n x^{2n} dx\end{align}$

Evaluating the integral yields

$\begin{align}=\sum_{n=0}^\infty \frac{c_n}{2n+1}x^{2n+1}\end{align}$

as a series expansion for $\arcsin{x}$ for $|x|<1$.

### Exercise 8.3.12
Now, we can extend the domain of the Taylor series for $\arcsin{x}$ from $(-1,1)$ to $[-1,1]$. First, consider the case of $x=1$. Substituting $x=1$ into the expansion yields

$\begin{align}\sum_{n=0}^\infty \frac{c_n}{2n+1}=1 + \sum_{n=1}^\infty \frac{1}{(2n+1)\sqrt{n}}c_n\sqrt{n}\end{align}$

Recall that $\lim_{n\to \infty} \frac{1}{c_n\sqrt{n}} = \sqrt{\pi}$. Then, $\lim_{n\to \infty} c_n\sqrt{n} = \frac{1}{\sqrt{\pi}}$. Since $c_n\sqrt{n}$ is increasing, we can bound $c_n\sqrt{n}\leq \frac{1}{\pi}$. Then, $0\leq \sum_{n=1}^\infty \frac{c_n}{2n+1}\leq \frac{1}{\sqrt{\pi}}\sum_{n=1}^\infty \frac{1}{(2n+1)\sqrt{n}}$. But $\sum_{n=1}^\infty \frac{1}{(2n+1)\sqrt{n}}\leq \sum_{n=1}^\infty \frac{1}{2n^{3/2}}$, which converges by the p-series test. Then, this series expansion converges point-wise at $x=1$.

To extend this result to $x=-1$, we start by substituting $x=-1$ into the $\arcsin{x}$ expansion as before.

$\begin{align}=\sum_{n=0}^\infty \frac{c_n}{2n+1}(-1)^{n}\end{align}$

We can use the Absolute Convergence Test here. If $\sum_{i=1}^n |\frac{c_n}{2n+1}(-1)^{n}|=\sum_{i=1}^n \frac{c_n}{2n+1}$ converges, so does the original series. But this is the series we examined when trying to prove that $\arcsin{x}$ converges at $x=1$. Then, the expansion for $\arcsin{x}$ converges point-wise at $x=-1$ as well.

### Exercise 8.3.13
All our groundwork will now come to fruition. We note that since $\arcsin{x}$ is the inverse function of $\sin{x}$, $\arcsin(\sin{x})=x$ for $x\in (-\frac{\pi}{2},\frac{\pi}{2})$.

 - We make the substitution $x=\sin{\theta}$ in the $\arcsin{x}$ sum. Then, we know that since the sum converges uniformly from Exercise 8.3.12, we can integrate this series term-wise as such: 
    $\begin{align}\int_0^{\pi/2}\theta d\theta=\int_0^{\pi/2}\sum_{n=0}^\infty \frac{c_n}{2n+1}\sin^{2n+1}(\theta) d\theta\end{align}$
    First, we bring the integral inside the sum. This is allowed by the Integrable Limit Theorem as the sum converges uniformly on the interval $[-\pi/2,\pi/2]$.
    $\begin{align}=\sum_{n=0}^\infty \int_0^{\pi/2} \frac{c_n}{2n+1}\sin^{2n+1}(\theta) d\theta\end{align}$
    We bring the terms that are not dependent on $\theta$ outside the integral, as they are constant factors.
    $\begin{align}=\sum_{n=0}^\infty \frac{c_n}{2n+1}\int_0^{\pi/2}\sin^{2n+1}(\theta) d\theta\end{align}$
    Here, the form of the odd Wallis integral is recognized. We make the substitution $b_{2n+1}=\int_0^{\pi/2}\sin^{2n+1}(\theta) d\theta$.
    $\begin{align}=\sum_{n=0}^\infty \frac{c_n}{2n+1}b_{2n+1}\end{align}$
 - The integral on the left-hand side is simple to calculate directly.
    $\begin{align}\int_0^{\pi/2} \theta d\theta=\frac{(\pi/2)^2}{2}=\pi/8\end{align}$
    To evaluate the integral on the right-hand side, we need to simplify the product $c_n\cdot b_{2n+1}$. We know that $c_n=\frac{(2n)!}{2^{2n}(n!)^2}$ and $b_{2n+1}=\frac{2^{2n}(n!)^2}{(2n+1)!}$ from our earlier work. Then,
    
    $\begin{align}c_n\cdot b_{2n+1} = \frac{(2n)!}{2^{2n}(n!)^2} \cdot \frac{2^{2n}(n!)^2}{(2n+1)!}=\frac{1}{2n+1}\end{align}$

    Then, $\frac{\pi}{8}=\sum_{i=0}^\infty \frac{1}{(2n+1)}\cdot \frac{1}{2n+1}$.
    We're in the home stretch now. Note that the sum we desire can be broken into two component sums representing the reciprocals of all even and all odd squares, respectively: 
    
    $\begin{align}\sum_{n=1}^\infty \frac{1}{n^2}=\sum_{n=1}^\infty \frac{1}{(2n)^2} + \sum_{n=1}^\infty \frac{1}{(2n-1)^2}\end{align}$
    
    This latter sum is what we have calculated to be $\frac{\pi}{8}$. The former sum is seen by inspection to be one-fourth of the desired sum: $\sum_{n=1}^\infty \frac{1}{(2n)^2} = \frac{1}{2^2}\sum_{n=1}^\infty \frac{1}{n^2}$. Then, letting $A=\sum_{n=1}^\infty \frac{1}{n^2}$, we have a simple linear equation in $A$, which leads us to the solution of the Basel problem:
    
    $\begin{align}A=\frac{1}{4}A + \frac{\pi}{8}\implies \boxed{ \sum_{n=1}^\infty \frac{1}{n^2}=\frac{\pi}{6} }\end{align}$

## By Trigonometry and Euler's Formula
This next proof is taken from Cambridge University's Sixth Term Examination Paper from 2018. Its structure goes as follows: (1) we establish the validity of a certain trigonometric identity, (2) we link this identity to a particular polynomial, and (3) we tie up all aspects to solve the Basel problem.

### Some Trigonometry
Consider the expression $\frac{(\cot{\theta} + i)^{2n+1}-(\cot{\theta} - i)^{2n+1}}{2i}$, where $i$ is the imaginary unit. We are tasked with simplifying this expression into a form that does not depend on any imaginary units.

This is where Euler's Formula comes in. Euler's Formula states that we can express real and imaginary parts of the complex exponential $e^{i\theta}$ as $\cos{\theta}$ and $i \sin{\theta}$, respectively. Note that the closest expression in our original statement to $\cos{\theta}+i\sin{\theta}$ is $\cot{\theta} + i$. After some inspection, we see that 

$\begin{align}e^{i\theta}=\cos{\theta}+i\sin{\theta}\implies \frac{e^{i\theta}}{\sin{\theta}}=\cot{\theta}+i\end{align}$

To obtain an alternate form for $\cot{\theta} - i$, note that negating $\theta$ leaves the real part unchanged, but negates the imaginary part. In other words

$\begin{align}e^{-i\theta}=\cos(-\theta)+i\sin(-\theta)=\cos{\theta}-i\sin{\theta}\implies \frac{e^{-i\theta}}{\sin{\theta}}=\cot{\theta}-i\end{align}$

Then, substituting this expression back into the original yields

$\begin{align}\frac{(\frac{e^{i\theta}}{\sin{\theta}})^{2n+1}-(\frac{e^{-i\theta}}{\sin{\theta}})^{2n+1}}{2i}\end{align}$
$\begin{align}=\frac{e^{i(2n+1)\theta}-e^{-i(2n+1)\theta}}{2i\sin^{2n+1}{\theta}}\end{align}$

Now, we can apply Euler's Formula once more, this time to convert the complex exponentials in the numerator into trigonometric quantities.

$\begin{align}=\frac{\cos((2n+1)\theta)+i\sin((2n+1)\theta)-\cos(-(2n+1)\theta)-i\sin(-(2n+1)\theta)}{2i\sin^{2n+1}{\theta}}\end{align}$
$\begin{align}=\frac{2i\sin{(2n+1)\theta}}{2i\sin^{2n+1}{\theta}}=\frac{\sin{(2n+1)\theta}}{\sin^{2n+1}{\theta}}\end{align}$

### Introducing a Polynomial
Let us look at the original expression $\frac{(\cot{\theta} + i)^{2n+1}-(\cot{\theta} - i)^{2n+1}}{2i}$ through another lens. We can use the Binomial Theorem to expand both terms in the numerator.

$\begin{align}=\frac{\sum_{k=0}^{2n+1} \binom{2n+1}{k}\cot^k{\theta}\cdot i^{2n+1-k}- \sum_{k=0}^{2n+1}\binom{2n+1}{k}\cot^k{\theta}\cdot (-i)^{2n+1-k}}{2i}\end{align}$
$\begin{align}=\frac{\sum_{k=0}^{2n+1} \binom{2n+1}{k}\cot^k{\theta}\cdot (i^{2n+1-k}-(-i)^{2n+1-k})}{2i}\end{align}$
$\begin{align}=\sum_{k=0}^{2n+1} \binom{2n+1}{2n+1-k}\cot^k{\theta}\cdot  \frac{i^{2n+1-k}(1-(-1)^{2n+1-k})}{2i}\end{align}$

For all the terms where the exponent $k$ on $\cot{\theta}$ is odd, the expression involving the imaginary unit evaluates to 0, so that term vanishes. For those terms where the exponent $k$ on $\cot{\theta}$ is even, the same expression alternates between $+2i$ and $-2i$, which cancels with the denominator.
$\begin{align}\frac{(\cot{\theta} + i)^{2n+1}-(\cot{\theta} - i)^{2n+1}}{2i}=\binom{2n+1}{2n}cot^{2n}(\theta)-\binom{2n+1}{2n-2}cot^{2n-2}(\theta)...+(-1)^n\end{align}$
If we let $x=\cot^{2}{\theta}$ and rewrite binomial coefficients using familiar combinatorial rules, we obtain a polynomial equation in $x$:
$\begin{align}=\binom{2n+1}{1}x^{n}-\binom{2n+1}{3}x^{n-1}+...+(-1)^n\end{align}$
At this moment in the proof, we have three equivalent interpretation of the same trigonometric identity. Now, we need to find the roots of this latest representation as a polynomial. However, since this polynomial is equivalent to the second representation we derived (i.e. as a ratio of expressions involving the $\sin(x)$ function), any roots of that expression must also be roots of this expression, and vice versa. Then, the roots of this polynomial are the roots of 
$\frac{\sin{(2n+1)\theta}}{\sin^{2n+1}{\theta}}$. It is clear that this expression evaluates to 0 when its numerator is 0. On the interval his happens when the argument of the sin function in the numerator is 0, or when $\theta=\frac{m\pi}{2n+1}$ for $m=1,2...n$. Then, $x=\cot^2(\frac{m\pi}{2n+1})$ for $m=1,2...n$.\\
Next, we want to find the sum of the roots of this polynomial. By Vieta's formulae, we know that this sum is the negative of the coefficient on the $x^{n-1}$ term divided by the coefficient on the $x^{n}$ term. Then, 
$\begin{align}\sum_{m=1}^n \cot^2(\frac{m\pi}{2n+1})=-\frac{-\binom{2n+1}{3}}{\binom{2n+1}{1}}=\frac{\frac{(2n+1)!}{(2n-2)!3!}}{\frac{(2n+1)!}{(2n)!1!}}=\frac{2n(2n-1)}{3!}=\frac{n(2n-1)}{3}\end{align}$

### Comparing Sums
Finally, let us make some notes about the domain we are working in. For $\theta\in(0,\pi/2)$, we are given that $0<\sin{\theta}<\theta<\tan(\theta)$. Then, $\tan(\theta)>\theta>0\implies \frac{1}{\theta^2}<\cot^2(\theta)$ and $0<\sin{\theta}<\theta\implies \frac{1}{\theta^2}<\frac{1}{\sin^2\theta}=\csc^2{\theta}=1+\cot^2{\theta}$. Condensing our results into a single inequality, we have found that on this domain, $\begin{align}\cot^2{\theta} < \frac{1}{\theta^2} < 1 + \cot^2{\theta}\end{align}$
For any number of terms $n$, we can compare the sums of the above expressions over the roots calculated earlier in place of $\theta$.
$\begin{align}\sum_{m=1}^n \cot^2(\frac{m\pi}{2n+1}) < \sum_{m=1}^n (\frac{2n+1}{m\pi})^2 < \sum_{m=1}^n 1 + \cot^2(\frac{m\pi}{2n+1})\end{align}$
We recognize the first and third sums as variations on the sum of roots we calculated manually earlier. Substitution of our previous result yields:
$\begin{align}\frac{n(2n-1)}{3} < \frac{(2n+1)^2}{\pi^2}\sum_{m=1}\frac{1}{m^2} < n + \frac{n(2n-1)}{3}\end{align}$
$\begin{align}\frac{n(2n-1)}{3(2n+1)^2}\pi^2 < \sum_{m=1}^n \frac{1}{m^2} < \pi^2\frac{2n(n+1)}{3(2n+1)^2}\end{align}$
Now, we can take the limit of each of the bounding expressions. We find that $\lim_{n\to\infty} \frac{n(2n-1)}{3(2n+1)^2}\pi^2 = \frac{\pi^2}{2\cdot 3}=\pi^2/6$ and  $\lim_{n\to\infty} \pi^2\frac{2n(n+1)}{3(2n+1)^2} = \frac{\pi^2}{2\cdot 3}=\pi^2/6$. Then, by the Squeeze Theorem, $\begin{align}\lim_{n\to \infty}\sum_{m=1}^n \frac{1}{m^2} = \boxed { \sum_{m=1}^\infty \frac{1}{m^2} = \frac{\pi^2}{6} } \end{align}$

## By a Double Integral
This final approach is due to Tom Apostol; we will represent a double integral as a familiar infinite series, and then we will solve the double integral by making a clever substitution.

### Revealing the Hidden Series
Consider the double integral $\int_0^1 \int_0^1 \frac{1}{1-xy} dx dy$. For points $(x,y)$ in the unit square, we know that $|xy|<1$. Then, we recognize the integrand as the sum of an infinite geometric series. We can replace the integrand with the series it defines implicitly.
$\begin{align}\int_0^1 \int_0^1 \frac{dx~dy}{1-xy} = \int_0^1 \int_0^1 \sum_{n=0}^\infty (xy)^n dx~dy\end{align}$
We move the integral on variable $x$ inside the sum and evaluate.
$\begin{align}= \int_0^1 \sum_{n=0}^\infty y^n \int_0^1 x^n dx~dy=\int_0^1 \sum_{n=0}^\infty y^n [\frac{x^{n+1}}{n+1}]_0^1 dx~dy\end{align}$
$\begin{align}=\int_0^1 \sum_{n=0}^\infty \frac{1}{n+1} y^n dy\end{align}$
We bring the integral on variable $y$ inside the sum as before, and arrive at a familiar conclusion.
$\begin{align}= \sum_{n=0}^\infty \frac{1}{n+1} \int_0^1 y^n dy = \sum_{n=0}^\infty \frac{1}{n+1} [\frac{y^{n+1}}{n+1}]_0^1 \end{align}$
$\begin{align}= \sum_{n=0}^\infty \frac{1}{(n+1)^2} = \sum_{n=1}^\infty \frac{1}{n^2}\end{align}$

### A Change of Perspective
Now, let us take a second look at the original integral. In its current form, it may be difficult to evaluate. We will apply a linear transformation to take this integral from $xy$-space to $uv$-space, defined as 
$\begin{align}u = \frac{1}{2}(x+y), v = \frac{1}{2}(y-x)\end{align}$
To go from $uv$-space back to $xy$-space, we apply the transformations $x=u-v$ and $y=u+v$. Then, the integrand $\frac{1}{1-xy}$ in $uv$-coordinates is $\frac{1}{1-(u-v)(u+v)}=\frac{1}{1-u^2+v^2}$. When going to this new coordinate space, we need to replace the differentials $dx~dy$ with their corresponding values in $uv$-space. For this, we need to calculate the Jacobian determinant of this transformation:
$\begin{align}\det(J)=
\begin{vmatrix*}
\frac{dx}{du} & \frac{dx}{dv} \\
\frac{dy}{du} & \frac{dy}{dv}
\end{vmatrix*} = 
\begin{vmatrix*}
1 & -1 \\
1 & 1
\end{vmatrix*} = 2\end{align}$
Then, after changing bounds into the appropriate coordinates, the region of integration is a square rotated $45^o$ clockwise with diagonal of length 1 lying along the x-axis. The integral needs to be written in two parts:
$\begin{align}\int_0^{1/2} \int_{-u}^u \frac{1}{1-u^2+v^2}\cdot 2 dv du + \int_{1/2}^1 \int_{-(1-u)}^{1-u} \frac{1}{1-u^2+v^2}\cdot 2 dv du\end{align}$
The form of these two integrals is made familiar by a minor cosmetic change. The integrand $\frac{1}{1-u^2+v^2}$ can be written as $\frac{1}{1+(\frac{v}{\sqrt{1-u^2}})^2}\cdot \frac{1}{1-u^2}$. This second term is not dependent on $v$ and so can be taken outside the innermost integral; the first term is reminiscent of the derivative of the $\arctan(x)$ function, $\frac{1}{1+x^2}$. Indeed, we can make progress in both integrals by making the substitution $z=\frac{v}{\sqrt{1-u^2}}, dz = \frac{dv}{\sqrt{1-u^2}}$. From here, we solve the two component integrals by different routes entirely.\\

### The First Integral, for $u$ from 0 to $\frac{1}{2}$
Applying this $z$-substitution yields the following:
$\begin{align}\int_0^{1/2} \int_{-u}^u \frac{1}{1-u^2+v^2}\cdot 2 dv du = \int_0^{1/2} [\frac{1}{\sqrt{1-u^2}}\arctan(\frac{v}{\sqrt{1-u^2}})]_{-u}^u \cdot 2 du\end{align}$
$\begin{align}=\int_0^{1/2} \frac{1}{\sqrt{1-u^2}}[\arctan(\frac{u}{\sqrt{1-u^2}}) - \arctan(\frac{-u}{\sqrt{1-u^2}})] \cdot 2 du\end{align}$
Since $\arctan(x)$ is an odd function, we can write the same more concisely as $\begin{align}=4\int_0^{1/2} \frac{1}{\sqrt{1-u^2}}\arctan(\frac{u}{\sqrt{1-u^2}}) du\end{align}$
If we could rewrite this integral in terms of a variable $\theta$, such that $\tan(\theta)=\frac{u}{\sqrt{1-u^2}}$, the $\arctan(x)$ function would undo the $\tan(x)$ function within. This implies that $u=\sin(\theta)$. Acting on this intuition, the new integral, recast in terms of $\theta$, is
$\begin{align}= 4\int_0^{\arcsin(1/2)} \frac{1}{\sqrt{1-\sin^2(\theta)}}\arctan(\frac{\sin(\theta)}{\sqrt{1-\sin^2(\theta)}}) \cos(\theta) d\theta \end{align}$
$\begin{align}= 4\int_0^{\pi/6} \frac{\cos(\theta)}{\cos(\theta)}\arctan(\tan(\theta)) d\theta\end{align}$
$\begin{align}= 4\int_0^{\pi/6} \theta d\theta = 4\cdot \frac{(\pi/6)^2}{2} = \boxed { \frac{\pi^2}{18} }\end{align}$

### The Second Integral, for $u$ from $\frac{1}{2}$ to $1$
The second integral takes a similar form to the first after the $z$-substitution outlined before, but with different bounds:
$\begin{align}\int_{1/2}^1 \int_{-(1-u)}^{1-u} \frac{1}{1-u^2+v^2}\cdot 2 dv du \end{align}$
$\begin{align}= \int_{1/2}^1 \frac{1}{\sqrt{1-u^2}}[\arctan(\frac{1-u}{\sqrt{1-u^2}}) - \arctan(\frac{-(1-u)}{\sqrt{1-u^2}})] \cdot 2 dv du\end{align}$
$\begin{align}=4\int_{1/2}^{1} \frac{1}{\sqrt{1-u^2}}\arctan(\frac{1-u}{\sqrt{1-u^2}}) du\end{align}$
Ideally, we would able to make progress by recognizing the expression inside the $\arctan(x)$ function as the tangent of some angle. However, this form seems foreign, unlike the form encountered in the first integral. We proceed with a more general idea: to solve for $u$ in terms of $\theta$ under the assumption that $\tan(m\theta)=u$. In this case, the half-angle formula for $\tan(\theta/2)$ appears helpful: $\begin{align}\tan(\theta/2)=\frac{1-\cos(\theta)}{\sin(\theta)}\end{align}$
Then, let $u=\cos(\theta)$. This yields:
$\begin{align}=4\int_{\pi/3}^{0} \frac{1}{\sqrt{1-\cos^2(\theta)}}\arctan(\frac{1-\cos(\theta)}{\sqrt{1-\cos^2(\theta)}}) (-\sin(\theta)) d\theta\end{align}$
$\begin{align}=4\int_{0}^{\pi/3} \arctan(\frac{1-\cos(\theta)}{\sin(\theta)}) d\theta\end{align}$
$\begin{align}=4\int_{0}^{\pi/3} \frac{\theta}{2} d\theta = 2\cdot \frac{(\pi/3)^2}{2} = \boxed { \frac{\pi^2}{9} }\end{align}$

### Comparing Evaluations
Then, we have two different representations for the same integral. One is as the solution to the Basel problem, derived by looking at the integrand as an infinite series. The other is by a change of coordinates and direct evaluation in the new space. Then, the two evaluations are equal to each other.
$\begin{align}\frac{\pi^2}{18} + \frac{\pi^2}{9} = \boxed { \sum_{n=1}^\infty \frac{1}{n^2} =  \frac{\pi^2}{6} }\end{align}$

## An Application in Probability
In this final section, we solve a practical problem in probability using the solution to the Basel problem. Consider the probability that two randomly chosen natural numbers less than $X$ are coprime to each other, i.e. that they share no common factors other than 1. We first need to classify the ways in which two numbers $A$ and $B$ can share a factor. It is clear that it suffices to show that two numbers do not have any prime common factors, in order to show that they are coprime. Then, we can calculate the probability that some prime $p$ does not divide both $A$ and $B$ as

$\begin{align}\textup{P}(\textup{p does not divide A and B})= 1 - \textup{P}(\textup{p divides A})\cdot \textup{P}(\textup{p divides B})\end{align}$
Here, we assume that the divisors of $A$ and $B$ are distributed independently. Around one in every $p$ natural numbers in $[1,X)$ are divisible by $p$, so $\begin{align}\textup{P}(\textup{p divides A})=\textup{P}(\textup{p divides B})=\frac{1}{p}\end{align}$
$\begin{align}\textup{P}(\textup{p does not divide A and B})=1-\frac{1}{p^2}\end{align}$
We need to make sure that none of the primes up to $X$ divide both $A$ and $B$. Assuming again that the divisibility of a number by one prime says nothing about its divisibility by another (independence), we can write
$\begin{align}\textup{P}(\textup{A and B have no common prime factors})=\Pi_{\textup{primes p<X}}~(1-\frac{1}{p^2}) \end{align}$
Since the terms in the sequence approach $1$ and all terms are non-zero, we know that this probability is non-zero. Indeed, taking the limits as $X\to \infty$ of this product yields an infinite product over all the primes, that represents the probability that any two natural numbers (unbounded) are coprime. Denoting our desired probability $P'$, we can then write:
$\begin{align}P'=\Pi_{\textup{primes p}}~(1-\frac{1}{p^2}) \implies \frac{1}{P'} = \Pi_{\textup{primes p}}~\frac{1}{1-\frac{1}{p^2}}\end{align}$
The expression inside the product is reminiscent of the infinite geometric series formula, with a ratio of $|\frac{1}{p^2}|<1$. Then, we can expand each of these implicit series to arrive at
$\begin{align}\frac{1}{P'}=\Pi_{\textup{primes p}}~(1 + \frac{1}{p^2} + \frac{1}{p^4} + \frac{1}{p^6} + ...)\end{align}$
We can imagine expanding out this infinite product over infinite series, and consider what terms will appear. The numerator of every term will be 1. The denominator will be the product of even powers of certain primes; then, the reciprocal of every natural number that is able to be represented as the product of even powers of primes will appear in the expansion. According to the Fundamental Theorem of Arithmetic, every natural number can be represented uniquely as the product of powers of primes. Then, every reciprocal of a square number will appear in the expanded product once and exactly once. Then,
$\begin{align}\frac{1}{P'}=\sum_{n=1}^\infty \frac{1}{n^2} \implies \boxed{ P' = \frac{6}{\pi^2} }\approx 60.793\%\end{align}$
Then, there is about a 60.793\% chance that two randomly selected natural numbers are coprime.

## Bibliography
 - The Galileo Project. (1995).
    From http://galileo.rice.edu/Catalog/NewFiles/mengoli.html
 - Pietro Mengoli - Biography. (2004). From https://mathshistory.st-andrews.ac.uk/Biographies/Mengoli/
 - Abbott, S. (2016). Understanding analysis. New York: Springer.
 - Cambridge STEP Exam Repository. (2018). From https://www.admissionstesting.org/for-test-takers/step/preparing-for-step/
 - Apostol, T. M. (1983). A proof that euler missed: evaluating $\zeta(2)$ the easy way. The Mathematical Intelligencer, 5(3), 59–60.
 - Aaron D. Abrams & Matteo J. Paris (1992). The Probability That (a, b) = 1. The College Mathematics Journal, 23:1, 47.