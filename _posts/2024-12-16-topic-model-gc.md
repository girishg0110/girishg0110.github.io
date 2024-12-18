---
layout: distill
title: topic modeling my group chats
description: data visualizations and nlp insights from e-conversations
tags: topic-modeling data-viz social-science
giscus_comments: false
date: 2024-12-16
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

bibliography: 2024-12-16-topic-model-gc.bib

toc:
  - name: Introduction

---

## Introduction

I downloaded the full transcript of all of my text conversations on Instagram and Facebook using the [Meta data download portal](https://www.facebook.com/help/212802592074644?helpref=faq_content) for each platform. Here are a couple of questions I investigated using the chat data between one of my friend groups from the past year.

Some notation will be useful for explaining the mathematical derivation of many of the techniques we will use. 
* $C = \{c_j\}$ is the set of chat members
* $M = \{m_i\}$ is the set of messages. 
* Each message $m_i=(t_i, c_i, d_i)$ is a tuple consisting of the timestamp $t_i$, the message sender $c_i$, and the message text (documents) $d_i$. 

In practice, the data is stored as a table, ordered by increasing timestamp, of messages tagged with their senders.


## What do we talk about?
I want to know what topics each of us talks about. Can we glean from the chat logs which of us is particularly interested in politics, sports, or tech topics? A branch of natural language processing called **topic modeling** describes computational methods for exactly this task. 

First, it is necessary to create some sort of numerical representation of each person's messages. Going from a set of written texts to a number of list of numbers, while retaining the information necessary to glean meaningful language insights, is a non-trivial task. Bag-of-word embeddings are one possible approach to quantifying linguistic data. 

## Embedding: bag-of-words vectors

To create a BoW embedding for a given sender $c$, we perform the following algorithm. 

1. Determine the vocabulary $V$ of unique meaningful "tokens" from $D = \{d_i\}$. A token can be as simple as a word separated by whitespace. You may also want to ensure that compound words and full names, like "electoral college" or "Lebron James", are considered as single tokens. It's also advisable to filter out punctuation marks, unreadable characters, and numbers, unless the high incidence of those characters would indicate something meaningful to you. 
2. Determine the set of documents $D_c=\{d\in D~|~sender(d) = c\}$ sent by $c$. 
3. For each vocabulary token $v\in V$, let $freq_{v,c}$ denote how many times $v$ occurs in the texts of $D_c$. Then,

$\begin{align}
  bow_c = \begin{pmatrix}freq_{v_1,c}\\ freq_{v_2,c}\\ ...\\ freq_{v_{|V|},c}\end{pmatrix} \in \mathbb{Z_{\geq 0}}^{|V|}
\end{align}$

The BoW embedding $bow_c$ will be a $|V|$-dimensional vector such that the $i$-th coordinate of $bow_c$ equals $freq_{v_i,c}$.

## Reweighting: tf-idf

<!-- NMF - personal -->



## What's in the news?
<!-- NMF - over time -->

## Who's active when?
<!-- time heatmap -->

## What's the mood?
<!-- rolling VADER sentiment -->

## Who has the last word?
<!-- double bar chart  -->

