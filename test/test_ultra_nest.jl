# This file is a part of UltraNest.jl, licensed under the MIT License (MIT).

using UltraNest
using Test

using Random, StatsBase, Distributions
using HypothesisTests


@testset "test_ultranest" begin
    dist = product_distribution([
        MixtureModel([truncated(Normal(-1, 0.1), -2, 0), truncated(Normal(1, 0.1), 0, 2)], [0.5, 0.5]),
        MixtureModel([truncated(Normal(-2, 0.25), -3, -1), truncated(Normal(2, 0.25), 1, 3)], [0.3, 0.7]),
        MixtureModel([truncated(Normal(-5, 0.25), -6, -4), truncated(Normal(5, 0.25), 4, 6)], [0.2, 0.8]),
    ])


    prior_transform = let dist=dist
        (u::AbstractVector{<:Real}) -> begin
            x0 = minimum.(dist.v)
            Δx = maximum.(dist.v) .- x0 
            u .* Δx .+ x0
        end
    end

    prior_transform_vectorized = let trafo = prior_transform
        (U::AbstractMatrix{<:Real}) -> reduce(vcat, (u -> trafo(u)').(eachrow(U)))
    end


    loglikelihood = let dist = dist
        function (x::AbstractVector{<:Real})
            ll = logpdf(dist, x)
            # lofpdf on MixtureModel returns NaN in gaps between distributions, and UltraNest
            # doesn't like -Inf, so return -1E10
            T = promote_type(Float32, typeof(ll))
            isnan(ll) ? T(-1E10) : T(ll)
        end
    end

    loglikelihood_vectorized = let loglikelihood = loglikelihood
        # UltraNest has variate in rows:
        (X::AbstractMatrix{<:Real}) -> loglikelihood.(eachrow(X))
    end


    paramnames = ["a", "b", "c"]
    smplr = ultranest.ReactiveNestedSampler(paramnames, loglikelihood_vectorized, transform = prior_transform_vectorized, vectorized = true)
    result = smplr.run(min_num_live_points = 4000, cluster_num_live_points = 400)
    @test result isa Dict

    X_un = result["samples"]::AbstractMatrix{<:Real}
    @test X_un isa AbstractMatrix{<:Real}

    X_iid = Array(rand(dist, 10^4)')   
    pvalues_ad = [pvalue(KSampleADTest(X_un[:,i], X_iid[:,i])) for i in axes(X_un, 2)]
    @test pvalues_ad[1] > 1E-4 && pvalues_ad[2] > 1E-4 && pvalues_ad[3] > 1E-4

    logz = result["logz"]
    logzerr = result["logzerr"]
    logz_expected = -log(prod(maximum.(dist.v) .- minimum.(dist.v)))
    @test isapprox(logz, logz_expected, atol = 10 * logzerr)
end
