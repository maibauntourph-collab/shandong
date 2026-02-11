/**
 * useAuth hook — exposes the current user's role and permission helpers.
 * Role hierarchy: owner > manager > staff
 */
export const useAuth = () => {
    const userStr = localStorage.getItem('adminUser');
    const user = userStr ? JSON.parse(userStr) : { username: 'unknown', role: 'staff' };

    // Normalize legacy 'admin' role to 'owner'
    const role = user.role === 'admin' ? 'owner' : (user.role || 'staff');

    return {
        username: user.username,
        role,
        isOwner: role === 'owner',
        isManager: role === 'owner' || role === 'manager',
        // Granular permissions
        canDelete: role === 'owner',
        canEditPrices: role === 'owner',
        canPublish: role === 'owner' || role === 'manager',
        canEditMenu: role === 'owner' || role === 'manager',
        canViewInventory: role === 'owner' || role === 'manager',
        canViewAnalytics: role === 'owner' || role === 'manager',
        canViewCustomers: role === 'owner' || role === 'manager',
        canManageSettings: role === 'owner',
    };
};

export type AuthRole = 'owner' | 'manager' | 'staff';
