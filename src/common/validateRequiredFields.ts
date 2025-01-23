import { isUndefined } from "@mjt-engine/object";

export const validateRequiredFields = (
  fields: Record<string, any>,
  requiredFields: string[]
) => {
  const missingFields = requiredFields.filter((field) =>
    isUndefined(fields[field])
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
};
