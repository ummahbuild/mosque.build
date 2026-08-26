// TypeScript-style pseudocode
async function issueDnsTxtChallenge(claim) {
  assertAuthenticated(claim.claimantId)
  const domain = canonicalizeRegistrableDomain(claim.domain)
  assertDomainIsPlausiblyRelatedToMosque(domain, claim.mosqueId)

  const rawToken = crypto.randomUUID() + "." + randomBytes(24).toString("base64url")
  await db.challenge.insert({
    claimId: claim.id,
    method: "dns_txt",
    domain,
    tokenHash: sha256(rawToken),
    host: `_mosquebuild-verify.${domain}`,
    expiresAt: addHours(now(), 72)
  })

  return {
    type: "TXT",
    host: `_mosquebuild-verify.${domain}`,
    value: `mosque-build-verification=${rawToken}`
  }
}

async function verifyDnsTxtChallenge(challenge, presentedToken) {
  assertNotExpired(challenge)
  const txt = await resolveTxt(challenge.host)
  const expected = `mosque-build-verification=${presentedToken}`
  if (!txt.flat().includes(expected)) return { verified: false }

  assert(timingSafeEqual(sha256(presentedToken), challenge.tokenHash))
  await markChallengeVerified(challenge.id, {
    resolverEvidence: txt,
    verifiedAt: now()
  })

  return runClaimRiskEngine(challenge.claimId)
}
