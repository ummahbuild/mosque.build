export type VerificationState="candidate"|"unverified"|"source_verified"|"claimed"|"verified_claimed"|"disputed"|"archived";
export type BuildStatus="concept"|"specified"|"scaffolded"|"executable"|"source_backed"|"beta"|"production_ready";
export type Provenance={sourceId:string;observedAt?:string;verifiedAt?:string;confidence?:"low"|"medium"|"high";rights?:string;notes?:string};
export type MoneyObservation={amount:number;currency:string;unit?:string;geography:string;observedAt:string;sourceId:string;confidence:"low"|"medium"|"high";maturity:string;exclusions?:string[]};
export type DomainObject={id:string;kind:string;projectId?:string;version:number;createdAt:string;updatedAt:string};
export type DesignObject=DomainObject&{kind:"wall"|"opening"|"room"|"column"|"slab"|"roof"|"fixture"|"product"|"landscape";geometryRef?:string;requirementIds?:string[];specificationId?:string;assetId?:string};
export type ExternalOffer={id:string;workId:string;sellerId:string;url:string;price?:MoneyObservation;availabilityObservedAt?:string;affiliateDisclosure?:string;provenance:Provenance[]};
