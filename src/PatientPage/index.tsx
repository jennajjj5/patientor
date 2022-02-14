import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { setPatient, useStateValue } from "../state";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { Container, Icon } from "semantic-ui-react";
import EntryDetails from "./entry";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient }, dispatch] = useStateValue();

  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/patients/${id}`);

    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    if (!patient || id !== patient.id) void fetchPatient();
  }, [dispatch]);

  if (!patient) return <div>Patient not found</div>;

  const genderIconClass = () => {
    if (patient.gender === "male") return "mars";
    if (patient.gender === "female") return "venus";
    return "genderless";
  };

  const containerStyle = {
    padding: "1rem 0.5rem",
  };

  return (
    <Container>
      <Container style={containerStyle}>
        <h2 style={{ display: "inline" }}>{patient.name}</h2>
        <Icon className={genderIconClass()} style={{ fontSize: "1.7rem" }} />
      </Container>
      <Container style={containerStyle}>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
      </Container>
      <Container style={containerStyle}>
        <h3>entries</h3>
        {patient.entries &&
          patient.entries.map((entry) => (
            <EntryDetails key={entry.id} entry={entry} />
          ))}
      </Container>
    </Container>
  );
};

export default PatientPage;
