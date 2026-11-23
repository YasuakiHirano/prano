export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface NavigationWorkspace {
    id: number;
    name: string;
    projects: {
        id: number;
        workspace_id: number;
        name: string;
        status: string;
    }[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    workspaces: NavigationWorkspace[];
    flash: {
        status?: string;
    };
};
