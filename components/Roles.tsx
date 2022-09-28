import { useContext } from 'react';
import { GlobalContext } from '../context';

const Roles = () => {
  const { updateRoles } = useContext(GlobalContext);

  const setRoles = (e: any) => {
    const formElement: HTMLFormElement | null = document.querySelector('form');
    const formData = new FormData(formElement || undefined);
    const editor = formData.get('editor')?.toString() || '';
    const admin = formData.get('admin')?.toString() || '';
    const super_admin = formData.get('super_admin')?.toString() || '';

    const roles: any = [editor, admin, super_admin].filter((i) => i) || [];

    updateRoles(roles);
  };

  return (
    <div className="roles-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <input onChange={setRoles} name="editor" value="EDITOR" type="checkbox" />
          <label>EDITOR</label>
          <input onChange={setRoles} name="admin" value="ADMIN" type="checkbox" />
          <label>ADMIN</label>
          <input onChange={setRoles} name="super_admin" value="SUPER_ADMIN" type="checkbox" />
          <label>SUPERADMIN</label>
        </div>
      </form>
    </div>
  );
};

export default Roles;
