import { Avatar } from '@heroui/avatar';

import { useAuthenticationStore } from '../store/authentication';

import DropDown from './dropdownProfile';

export default function UserAvatar() {
  const { payload } = useAuthenticationStore();

  return (
    <div className="flex gap-3 items-center">
      <div className="flex flex-col justify-center items-end">
        <p className="text-sm font-semibold capitalize">{payload.name}</p>
        <p className="text-xs text-default-400">{payload.email}</p>
      </div>
      <DropDown>
        <Avatar
          className="cursor-pointer"
          name={payload.name
            ?.split(' ')
            .map((val) => val[0].toUpperCase())
            .join('')}
        />
      </DropDown>
    </div>
  );
}
