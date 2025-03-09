'use client';

import React from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Image } from '@heroui/image';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import { Textarea } from '@heroui/input';

import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import useProvincesData from '@/shared/hooks/regencies/useProvincesData';
import { InputPassword } from '@/shared/components/inputPassword';

import { Controller, FieldErrors, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegisterFormStore } from '@/shared/store/registerFormStore';
import { Form } from '@heroui/form';

const schema = yup
  .object({
    username: yup.string().required(),
    email: yup.string().email().required(),
    phone_number: yup
      .string()
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .required(),
    password: yup.string().required(),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required(),
  })
  .required();

function FormRegisterUser() {
  const { payload, onSubmit } = useRegisterFormStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { ...payload }, resolver: yupResolver(schema) });

  return (
    <Form className="relative flex flex-col min-h-[490px] pb-[50px] gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="username"
        label="Username"
        labelPlacement="outside"
        placeholder="Enter your username"
        variant="bordered"
        {...register('username')}
        errorMessage={errors['username']?.message}
        isInvalid={!!errors['username']?.message}
      />
      <Input
        id="email"
        label="Email"
        labelPlacement="outside"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
        {...register('email')}
        errorMessage={errors['email']?.message}
        isInvalid={!!errors['email']?.message}
      />
      <Input
        id="phone number"
        label="Phone Number"
        labelPlacement="outside"
        placeholder="Enter your phone number"
        variant="bordered"
        {...register('phone_number')}
        errorMessage={errors['phone_number']?.message}
        isInvalid={!!errors['phone_number']?.message}
      />
      <InputPassword
        id="password"
        label="Password"
        labelPlacement="outside"
        placeholder="Enter your password"
        variant="bordered"
        {...register('password')}
        errorMessage={errors['password']?.message}
        isInvalid={!!errors['password']?.message}
      />
      <InputPassword
        id="confirm password"
        label="Confirm Password"
        labelPlacement="outside"
        placeholder="Confirm your confirm password"
        variant="bordered"
        {...register('confirm_password')}
        errorMessage={errors['confirm_password']?.message}
        isInvalid={!!errors['confirm_password']?.message}
      />

      <Button fullWidth color="primary" className="absolute bottom-0" type="submit">
        {'Next'}
      </Button>
    </Form>
  );
}

const schemaLocation = yup
  .object({
    provincie: yup.string().required(),
    regency: yup.string().required(),
    district: yup.string().required(),
    village: yup.string().required(),
    address: yup.string().required(),
  })
  .required();

function FormRegisterBankLocation() {
  const {  onSubmitLocation } = useRegisterFormStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ 
    resolver: yupResolver(schemaLocation),
  });

  const [selectedProvince, setSelectedProvince] = React.useState({
    provicieId: '',
    regencyId: '',
    districtId: '',
    villageId: '',
  });
  const { getListDistricts, getListProvinces, getListRegencies, getListVillages } = useProvincesData();

  return (
    <Form className="relative flex flex-col min-h-[490px] pb-[50px] gap-4" onSubmit={handleSubmit(onSubmitLocation)}>
      <Controller
        name="provincie"
        control={control}
        render={({ field: { onChange, ...controllerProps } }) => (
          <Autocomplete
            {...controllerProps}
            label="Provinsi"
            labelPlacement="outside"
            placeholder="Search Provinsi"
            variant="bordered"
            defaultItems={getListProvinces()}
            onSelectionChange={(data) => {
              onChange(data);
              setSelectedProvince(prev => ({...prev, provicieId: data as string}));
            }}
            // onSelectionChange={(val)=> }
            // {...register('provincie')}
            errorMessage={errors['provincie']?.message}
            isInvalid={!!errors['provincie']?.message}
          >
            {(location) => <AutocompleteItem key={location.value}>{location.label}</AutocompleteItem>}
          </Autocomplete>
        )}
      />
      <Controller
        name="regency"
        control={control}
        render={({ field: { onChange, ...controllerProps } }) => (
          <Autocomplete
            {...controllerProps}
            label="Kabupatien/Kota"
            labelPlacement="outside"
            placeholder="Search Kabupaten/Kota"
            variant="bordered"
            defaultItems={getListRegencies(selectedProvince.provicieId)}
            onSelectionChange={(data) => {
              onChange(data);
              setSelectedProvince(prev => ({...prev, regencyId: data as string}))
            }}
            // onSelectionChange={(val)=> }
            // {...register('provincie')}
            errorMessage={errors['regency']?.message}
            isInvalid={!!errors['regency']?.message}
          >
            {(location) => <AutocompleteItem key={location.value}>{location.label}</AutocompleteItem>}
          </Autocomplete>
        )}
      />
      <Controller
        name="district"
        control={control}
        render={({ field: { onChange, ...controllerProps } }) => (
          <Autocomplete
            {...controllerProps}
            label="Kecamatan"
            labelPlacement="outside"
            placeholder="Search Kecamatan"
            variant="bordered"
            defaultItems={getListDistricts(selectedProvince.regencyId)}
            onSelectionChange={(data) => {
              onChange(data);
              setSelectedProvince(prev => ({...prev, districtId: data as string}))
            }}
            // onSelectionChange={(val)=> }
            // {...register('provincie')}
            errorMessage={errors['district']?.message}
            isInvalid={!!errors['district']?.message}
          >
            {(location) => <AutocompleteItem key={location.value}>{location.label}</AutocompleteItem>}
          </Autocomplete>
        )}
      />
      <Controller
        name="village"
        control={control}
        render={({ field: { onChange, ...controllerProps } }) => (
          <Autocomplete
            {...controllerProps}
            label="Kelurahan"
            labelPlacement="outside"
            placeholder="Search Kelurahan"
            variant="bordered"
            defaultItems={getListVillages(selectedProvince.districtId)}
            onSelectionChange={(data) => onChange(data)}
            // onSelectionChange={(val)=> setSelectedProvince(prev => ({...prev, provicieId: val as string}))}
            // {...register('provincie')}
            errorMessage={errors['village']?.message}
            isInvalid={!!errors['village']?.message}
          >
            {(location) => <AutocompleteItem key={location.value}>{location.label}</AutocompleteItem>}
          </Autocomplete>
        )}
      />

      <Textarea
        label="Alamat"
        labelPlacement="outside"
        placeholder="Alamat lokasi bank"
        variant="bordered"
        {...register('address')}
        errorMessage={errors['address']?.message}
        isInvalid={!!errors['address']?.message}
      />

      <Button fullWidth color="primary" className="absolute bottom-0" type="submit">
        {'Submit'}
      </Button>
    </Form>
  );
}

const stepperItems = [
  {
    id: 'register-user',
    label: 'Register User',
    Content: FormRegisterUser,
  },
  {
    id: 'register-bank-location',
    label: 'Register Bank Location',
    Content: FormRegisterBankLocation,
  },
];

export default function ExamplePage() {
  const [stepTab, setStepTab] = React.useState(stepperItems[0].id);
  const { stepRegisterId, setStepRegisterId } = useRegisterFormStore();

  return (
    <Card className="max-w-[400px] w-[420px] p-2">
      <CardHeader className="flex gap-3">
        <Link href="/">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
        </Link>
        <div className="flex flex-col">
          <p className="text-md">Register to Bash App</p>
          <p className="text-small text-default-500">by budimind.com</p>
        </div>
      </CardHeader>
      <CardBody>
        <Tabs
          aria-label="Dynamic tabs"
          items={stepperItems}
          selectedKey={stepperItems[stepRegisterId].id}
          onSelectionChange={(key) => {
            setStepRegisterId(stepperItems.findIndex((item) => item.id === key));
          }}
        >
          {(item) => (
            <Tab key={item.id} title={item.label} className="w-full">
              <item.Content />
            </Tab>
          )}
        </Tabs>
      </CardBody>
      <CardFooter className="flex flex-col gap-2 justify-center items-center">
        <p>
          {"Already have an acount,"} <Link href="/login">Login here</Link>
        </p>
        <Link href="/forgot">forgot password?</Link>
      </CardFooter>
    </Card>
  );
}
