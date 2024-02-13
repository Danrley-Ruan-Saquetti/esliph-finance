export type CustomerModel = {
    id: number;
    code: string;
    login: string;
    people: {
        id: number;
        name: string;
        itinCnpj: string;
        type: Database.$Enums.PeopleType;
    }
}