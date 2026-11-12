export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    phone: string | null;
    email: string | null;
}

export interface CreatePatientInput {
    firstName: string;
    lastName: string;
    dateOfBirth?: string | null;
    phone?: string | null;
    email?: string | null;
}

export interface UpdatePatientInput {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string | null;
    phone?: string | null;
    email?: string | null;
}
