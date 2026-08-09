export type ParticipationRoute = {
  id: string;
  title: string;
  recipient: string;
  target: string;
  procedure: string;
  flow: string;
  canDo: string;
  cannotGuarantee: string;
  officialGuideUrl: string;
  relatedOfficialGuide?: {
    label: string;
    url: string;
  };
};
