# This file is a part of UltraNest.jl, licensed under the MIT License (MIT).

using Test
using UltraNest
import Documenter

Documenter.DocMeta.setdocmeta!(
    UltraNest,
    :DocTestSetup,
    :(using UltraNest);
    recursive = true
)
Documenter.doctest(UltraNest)
