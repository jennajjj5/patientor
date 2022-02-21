import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { setPatient, useStateValue } from "../state";
import { Entry, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { Button, Container, Icon } from "semantic-ui-react";
import EntryDetails from "./entry";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

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

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      console.log(values);
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      console.log(newEntry);
      if (patient) {
        patient.entries = patient.entries
          ? patient.entries.concat(newEntry)
          : [newEntry];
        dispatch(setPatient(patient));
      }
      closeModal();
    } catch (e) {
      console.error(e.response?.data || "Unknown Error");
      setError(e.response?.data?.error || "Unknown error");
    }
  };

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
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </Container>
  );
};

export default PatientPage;
