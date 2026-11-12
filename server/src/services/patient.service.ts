import { db } from "../db/index.js";
import { patients } from "../db/schema/patients.js";
import type { CreatePatientInput, Patient, UpdatePatientInput } from "../types/patient.types.js";
import { eq, isNull, and } from "drizzle-orm";

export const createPatient = async (input: CreatePatientInput) => {
    const [patient] = await db.insert(patients).values(input).returning();

    return patient;
};

export const getPatientById = async (patientId: string): Promise<Patient | null> => {
    const [patient] = await db
        .select()
        .from(patients)
        .where(and(eq(patients.id, patientId), isNull(patients.archivedAt)));
    return patient ?? null;
};

export const getAllPatients = async (): Promise<Patient[]> => {
    const allPatients = await db.select().from(patients).where(isNull(patients.archivedAt));

    return allPatients;
};

export const updatePatient = async (patientId: string, input: UpdatePatientInput): Promise<Patient | null> => {
    const [updatedPatient] = await db
        .update(patients)
        .set({
            ...input,
            updatedAt: new Date(),
        })
        .where(eq(patients.id, patientId))
        .returning();

    return updatedPatient ?? null;
};

export const archivePatient = async (patientId: string): Promise<Patient | null> => {
    const [archivedPatient] = await db
        .update(patients)
        .set({
            archivedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(patients.id, patientId))
        .returning();

    return archivedPatient ?? null;
};

export const restorePatient = async (patientId: string): Promise<Patient | null> => {
    const [restoredPatient] = await db
        .update(patients)
        .set({
            archivedAt: null,
            updatedAt: new Date(),
        })
        .where(eq(patients.id, patientId))
        .returning();

    return restoredPatient ?? null;
};
