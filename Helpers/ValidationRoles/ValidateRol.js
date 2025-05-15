export class RolValidate{

     static hasRole(userRoles, role) {
        return (userRoles & role) === role;
      }
      
      static addRole(userRoles, role) {
        return userRoles | role;
      }
      
      static removeRole(userRoles, role) {
        return userRoles & ~role;
      }
}