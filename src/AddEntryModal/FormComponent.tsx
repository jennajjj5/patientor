import React from "react";
import { Field } from "formik";
import { Button, Form, Grid } from "semantic-ui-react";
import { Entry } from "../types";
import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";

export type TypeOption = {
  value: Entry["type"];
  label: string;
};

type SelectFieldProps = {
  name: string;
  label: string;
  options: TypeOption[];
};

export const SelectField = ({ name, label, options }: SelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);

export const typeOptions: TypeOption[] = [
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "OccupationalHealthcare" },
  { value: "HealthCheck", label: "HealthCheck" },
];

export const BaseEntryFields = (
  setFieldValue: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void,
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void
) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <>
      <SelectField label="Type" name="type" options={typeOptions} />
      <Field
        label="Description"
        placeholder="Description"
        name="description"
        component={TextField}
      />
      <Field
        label="Date"
        placeholder="YYYY-MM-DD"
        name="date"
        component={TextField}
      />
      <Field
        label="Specialist"
        placeholder="Specialist"
        name="specialist"
        component={TextField}
      />
      <DiagnosisSelection
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        diagnoses={Object.values(diagnoses)}
      />
    </>
  );
};

export const FormButtons = (
  dirty: boolean,
  isValid: boolean,
  onCancel: () => void
) => {
  return (
    <Grid>
      <Grid.Column floated="left" width={5}>
        <Button type="button" onClick={onCancel} color="red">
          Cancel
        </Button>
      </Grid.Column>
      <Grid.Column floated="right" width={5}>
        <Button
          type="submit"
          floated="right"
          color="green"
          disabled={!dirty || !isValid}
        >
          Add
        </Button>
      </Grid.Column>
    </Grid>
  );
};
