import { Roles } from '../types';

const pathRoles: { [key: string]: [Roles] } = {
  'edit-[blog]': ['ADMIN'],
  create: ['EDITOR']
};

export default pathRoles;
