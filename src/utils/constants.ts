import { PositionTypeEnum } from "@/enums/enums";

export const getCompanyLogoUrl = (domain: string) =>
  `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;

export const positionType = [
  { id: "pt1", key: "Talent", value: PositionTypeEnum.TALENT },
  { id: "pt2", key: "Engineering", value: PositionTypeEnum.ENGINEERING },
  { id: "pt3", key: "Manager", value: PositionTypeEnum.MANAGER },
  { id: "pt4", key: "Head", value: PositionTypeEnum.HEAD },
  { id: "pt5", key: "Others", value: PositionTypeEnum.OTHERS },
];
