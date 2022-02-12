import { State } from "./state";
import { Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "SET_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "SET_PATIENT":
      return {
        ...state,
        patient: {
          ...action.payload,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    default:
      return state;
  }
};

export const setPatientList = (patients: Patient[]) => {
  const action: Action = { type: "SET_PATIENT_LIST", payload: patients };
  return action;
};

export const setPatient = (patient: Patient) => {
  const action: Action = { type: "SET_PATIENT", payload: patient };
  return action;
};

export const addPatient = (newPatient: Patient) => {
  const action: Action = { type: "ADD_PATIENT", payload: newPatient };
  return action;
};
