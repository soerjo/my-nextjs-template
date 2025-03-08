'use client';

import React from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Image } from '@heroui/image';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';

import { useAuthLogin } from '@/shared/hooks/authentication';

function FormRegisterUser({ onSubmit }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <Form className="flex flex-col gap-4 mb-8" validationBehavior="aria" onSubmit={onSubmit}>
      <Input
        id="email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
      />
      <Input
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            // onClick={toggleVisibility}
          >
            {/* {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )} */}
          </button>
        }
        id="password"
        label="Password"
        labelPlacement="outside"
        name="password"
        placeholder="Enter your password"
        // type={isVisible ? 'text' : 'password'}
        variant="bordered"
      />
      <Button fullWidth color="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

function FormRegisterBankLocation({ onSubmit }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <Form className="flex flex-col gap-4 mb-8" validationBehavior="aria" onSubmit={onSubmit}>
      <Input
        id="email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
      />
      <Input
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            // onClick={toggleVisibility}
          >
            {/* {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )} */}
          </button>
        }
        id="password"
        label="Password"
        labelPlacement="outside"
        name="password"
        placeholder="Enter your password"
        // type={isVisible ? 'text' : 'password'}
        variant="bordered"
      />
      <Button fullWidth color="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default function ExamplePage() {
  const { mutate: authLogin, isPending } = useAuthLogin();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { email: string; password: string };

    authLogin({ email: data.email, password: data.password });
  };

  return (
    <Card className="max-w-[400px] w-[380px] p-2">
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
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Dynamic tabs"
            items={[
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
            ]}
          >
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <Card>
                  <item.Content onSubmit={onSubmit} />
                </Card>
              </Tab>
            )}
          </Tabs>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col gap-2 justify-center items-center">
        <p>
          {"Don't have an account?"} <Link href="/signup">Register here</Link>
        </p>
        <Link href="/forgot">forgot password?</Link>
      </CardFooter>
    </Card>
  );
}
