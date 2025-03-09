import { create } from 'zustand';

interface IUserFormPayload {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

interface ILocationForm {
  provincie: string,
  regency: string,
  district: string,
  village: string,
  address: string,
}

interface IAuthenticationState {
  payload: IUserFormPayload & ILocationForm;
  stepRegisterId: number;
  setStepRegisterId: (key: number) => void;
  onSubmit: (dto: IUserFormPayload) => void;
  onSubmitLocation: (dto: ILocationForm) => void;
}
export const useRegisterFormStore = create<IAuthenticationState>((set) => ({
  payload: {
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    provincie: "",
    regency: "",
    district: "",
    village: "",
    address: "",
  },
  stepRegisterId: 0,
  setStepRegisterId: (id: number) => {
    set((state) => ({
      ...state,
      stepRegisterId: id,
    }));
  },
  onSubmit: (dto) => {
    set((state) => ({
      stepRegisterId: state.stepRegisterId + 1,
      payload: {
        ...state.payload,
        username: dto.username,
        email: dto.email,
        phone_number: dto.phone_number,
        password: dto.password,
        confirm_password: dto.confirm_password,
      },
    }));
  },
  onSubmitLocation: (dto) => {
    console.log({dtoLocation:dto})
    set((state) => ({
      payload: {
        ...state.payload,
        ...dto
      },
    }));
  },
}));