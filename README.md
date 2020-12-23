# UltraNest.jl

[![Documentation for stable version](https://img.shields.io/badge/docs-stable-blue.svg)](https://bat.github.io/UltraNest.jl/stable)
[![Documentation for development version](https://img.shields.io/badge/docs-dev-blue.svg)](https://bat.github.io/UltraNest.jl/dev)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE.md)
[![Build Status](https://github.com/bat/UltraNest.jl/workflows/CI/badge.svg?branch=master)](https://github.com/bat/UltraNest.jl/actions?query=workflow%3ACI)
[![Codecov](https://codecov.io/gh/bat/UltraNest.jl/branch/master/graph/badge.svg)](https://codecov.io/gh/bat/UltraNest.jl)


## Documentation

* [Documentation for stable version](https://bat.github.io/UltraNest.jl/stable)
* [Documentation for development version](https://bat.github.io/UltraNest.jl/dev)

This is a Julia wrapper for Python nested sampling package
[UltraNest](https://github.com/JohannesBuchner/UltraNest).

Nested sampling allows Bayesian inference on arbitrary user-defined likelihoods. In particular, posterior probability distributions on model parameters are constructed, and the marginal likelihood ("evidence") Z is computed. The former can be used to describe the parameter constraints of the data, the latter can be used for model comparison (via *Bayes factors*) as a measure of the prediction parsimony of a model.

UltraNest provides novel, advanced techniques (see [how it works](https://johannesbuchner.github.io/UltraNest/method.html)). They are especially remarkable for being free of tuning parameters and theoretically justified. Beyond that, UltraNest has support for Big Data sets and high-performance computing applications.
