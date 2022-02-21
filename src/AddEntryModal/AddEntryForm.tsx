import React from "react";
import { Field, Formik, Form } from "formik";
import { BaseEntryFields, FormButtons, typeOptions } from "./FormComponent";
import {
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthCareEntry,
} from "../types";
import { validateFields } from "./FormValidation";
import { NumberField, TextField } from "../AddPatientModal/FormField";

export type EntryFormValues =
  | HospitalEntryFormValues
  | HealthCheckEntryFormValues
  | OccupationalHealthcareFormValues;

export type HospitalEntryFormValues = Omit<HospitalEntry, "id">;
export type OccupationalHealthcareFormValues = Omit<
  OccupationalHealthCareEntry,
  "id"
>;
export type HealthCheckEntryFormValues = Omit<HealthCheckEntry, "id">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const HospitalEntryFields = () => {
  return (
    <>
      <p>Discharge:</p>
      <Field
        label="Date"
        placeholder="YYYY-MM-DD"
        name="discharge.date"
        component={TextField}
      />
      <Field
        label="Criteria"
        placeholder="Criteria"
        name="discharge.criteria"
        component={TextField}
      />
    </>
  );
};

const OccupationalHealthCareEntryFields = () => {
  return (
    <>
      <Field
        label="EmployerName"
        placeholder="EmployerName"
        name="employerName"
        component={TextField}
      />
      <p>Sick Leave:</p>
      <Field
        label="StartDate"
        placeholder="YYYY-MM-DD"
        name="sickLeave.startDate"
        component={TextField}
      />
      <Field
        label="EndDate"
        placeholder="YYYY-MM-DD"
        name="sickLeave.endDate"
        component={TextField}
      />
    </>
  );
};

const HealthCheckEntryFields = () => {
  return (
    <>
      <Field
        label="HealthCheckRating"
        name="healthCheckRating"
        component={NumberField}
        min={0}
        max={3}
      />
    </>
  );
};

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [type, setType] = React.useState(typeOptions[2].value);
  const [initialValues, setInitialValues] = React.useState<EntryFormValues>({
    type: "Hospital",
    description: "",
    date: "",
    specialist: "",
    discharge: {
      date: "",
      criteria: "",
    },
  });

  React.useEffect(() => {
    if (type === "Hospital") {
      setInitialValues({
        type: "Hospital",
        description: "",
        date: "",
        specialist: "",
        discharge: {
          date: "",
          criteria: "",
        },
      });
    }
    if (type === "HealthCheck") {
      setInitialValues({
        type: "HealthCheck",
        description: "",
        date: "",
        specialist: "",
        healthCheckRating: 0,
      });
    }
    if (type === "OccupationalHealthcare") {
      setInitialValues({
        type: "OccupationalHealthcare",
        description: "",
        date: "",
        specialist: "",
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
      });
    }
  }, [type]);

  const EntryForm = () => {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={(values) => {
          if (values.type !== type) {
            setType(values.type);
          }
          return validateFields(values);
        }}
      >
        {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
          return (
            <Form className="form ui">
              {BaseEntryFields(setFieldValue, setFieldTouched)}
              {type === "Hospital" && HospitalEntryFields()}
              {type === "OccupationalHealthcare" &&
                OccupationalHealthCareEntryFields()}
              {type === "HealthCheck" && HealthCheckEntryFields()}
              {FormButtons(dirty, isValid, onCancel)}
            </Form>
          );
        }}
      </Formik>
    );
  };

  return <EntryForm />;
};

export default AddEntryForm;
