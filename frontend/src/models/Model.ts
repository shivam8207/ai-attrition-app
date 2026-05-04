export type Data = {
  name: string;
  totalExp: string;
  totalWorkOrgs: string;
  monthsInOrg: string;
  lastPay: string;
  averageFeedback: string;
  promotion: string;
};

export type ApiResponse = {
  attrition: number;
  error?: string;
};

export type AttritionData = {
  name: string;
  attrition: number;
};
