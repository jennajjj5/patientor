import React from "react";
import { useStateValue } from "../state";
import { Icon } from "semantic-ui-react";
import {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthCareEntry,
} from "../types";

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();

  const entryStyle = {
    border: "1px solid gray",
    borderRadius: "5px",
    padding: "0.7rem",
    margin: "0.5rem 0",
  };

  const BaseEntry = ({
    iconClass,
    employerName = "",
  }: {
    iconClass: string;
    employerName?: string;
  }) => {
    return (
      <>
        <h3>
          <span>{entry.date}</span>
          <Icon
            className={iconClass}
            style={{
              fontSize: "1.7rem",
              marginLeft: "1rem",
              marginRight: "2rem",
            }}
          />
          <span>{employerName}</span>
        </h3>
        <p>{entry.description}</p>
        <ul>
          {entry.diagnosisCodes &&
            entry.diagnosisCodes.map((diagnosisCode) => (
              <li key={diagnosisCode}>
                <span>{diagnosisCode} </span>
                {diagnoses[diagnosisCode] && (
                  <span>{diagnoses[diagnosisCode].name}</span>
                )}
              </li>
            ))}
        </ul>
      </>
    );
  };

  const HospitalEntry = ({ entry }: { entry: HospitalEntry }) => {
    return (
      <div style={entryStyle}>
        <BaseEntry iconClass="hospital outline" />
        <p>{entry.discharge.date}</p>
        <p>{entry.discharge.criteria}</p>
      </div>
    );
  };

  const OccupationalHealthCareEntry = ({
    entry,
  }: {
    entry: OccupationalHealthCareEntry;
  }) => {
    return (
      <div style={entryStyle}>
        <BaseEntry iconClass="stethoscope" employerName={entry.employerName} />
        {entry.sickLeave && (
          <>
            <p>{`Sick leave: ${entry.sickLeave.startDate} - ${entry.sickLeave.endDate}`}</p>
          </>
        )}
      </div>
    );
  };

  const HealthCheckEntry = ({ entry }: { entry: HealthCheckEntry }) => {
    const iconColor = () => {
      switch (entry.healthCheckRating) {
        case 0:
          return "green";
        case 1:
          return "yellow";
        default:
          return "red";
      }
    };

    return (
      <div style={entryStyle}>
        <BaseEntry iconClass="heart outline" />
        <Icon
          className="heart"
          style={{ color: iconColor(), fontSize: "1.2rem" }}
        />
      </div>
    );
  };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthCareEntry entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
