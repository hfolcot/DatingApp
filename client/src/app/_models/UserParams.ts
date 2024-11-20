import { User } from "./User";

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 110;
    pageNumber = 1;
    pageSize = 5;
    orderBy = "lastActive";

    constructor(user: User | null) {
        this.gender = user?.gender === 'female' ? 'male' : 'female'; 
    }
}