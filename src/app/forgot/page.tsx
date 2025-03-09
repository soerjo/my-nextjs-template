'use client';

import React from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Image } from '@heroui/image';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';

import { useAuthLogin } from '@/shared/hooks/authentication';

export default function ExamplePage() {
  const { mutate: authLogin, isPending } = useAuthLogin();

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
          <p className="text-md">Forgot Password</p>
          <p className="text-small text-default-500">do a reset request password</p>
        </div>
      </CardHeader>
      <CardBody>
        <Form className="flex flex-col gap-6" validationBehavior="aria" onSubmit={onSubmit}>
          <Input
            id="email"
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Button fullWidth color="primary" isDisabled={isPending} type="submit">
            Submit
          </Button>
        </Form>
      </CardBody>
      <CardFooter className="flex flex-col justify-center items-center">
        <p>
          {'Already have an account?'} <Link href="/login">SignIn here!</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
