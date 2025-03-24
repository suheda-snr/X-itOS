export interface Company {
    id: string;
    name: string;
    address: string;
    city: string;
    vat: string;
    postalCode: string;
    description: string;
    ownerId: string | null;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}
