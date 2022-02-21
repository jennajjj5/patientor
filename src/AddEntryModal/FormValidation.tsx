import { HealthCheckRating } from "../types";
import { EntryFormValues } from "./AddEntryForm";

const isString = (text: unknown) => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string) => {
  return Boolean(Date.parse(date));
};

export const validateFields = (values: EntryFormValues) => {
  const malformattedError = "Field is malformatted";
  const requiredError = "Field is required";
  const errors:
    | { [field: string]: string }
    | {
        [object: string]: {
          [field: string]: string;
        };
      } = {};

  if (!values.type) errors.type = requiredError;

  if (!values.description) errors.description = requiredError;
  if (!isString(values.description)) errors.description = malformattedError;

  if (!values.date) errors.date = requiredError;
  if (!isDate(values.date)) errors.date = malformattedError;

  if (!values.specialist) errors.specialist = requiredError;
  if (!isString(values.specialist)) errors.specialist = malformattedError;

  if (values.type === "Hospital") {
    errors.discharge = {};

    if (!values.discharge || !values.discharge.date)
      errors.discharge.date = requiredError;
    else if (!isDate(values.discharge.date))
      errors.discharge.date = malformattedError;
    else if (!values.discharge || !values.discharge.criteria)
      errors.discharge.criteria = requiredError;
    else if (!isString(values.discharge.criteria))
      errors.discharge.criteria = malformattedError;
    else delete errors.discharge;
  }

  if (values.type === "OccupationalHealthcare") {
    if (!values.employerName) errors.employerName = requiredError;
    if (!isString(values.employerName)) errors.employerName = malformattedError;

    if (values.sickLeave) {
      errors.sickLeave = {};

      if (!values.sickLeave.startDate)
        errors.sickLeave.startDate = requiredError;
      else if (!isDate(values.sickLeave.startDate))
        errors.sickLeave.startDate = malformattedError;
      else if (!values.sickLeave.endDate)
        errors.sickLeave.endDate = requiredError;
      else if (!isDate(values.sickLeave.endDate))
        errors.sickLeave.endDate = malformattedError;
      else delete errors.sickLeave;
    }
  }

  if (values.type === "HealthCheck") {
    if (!values.healthCheckRating) errors.healthCheckRating = requiredError;
    if (!Object.values(HealthCheckRating).includes(values.healthCheckRating))
      errors.healthCheckRating = malformattedError;
  }

  return errors;
};
