'use client';

import React from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Image } from '@heroui/image';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/shared/components/icon/eyePassword';
import { Button } from '@heroui/button';
import { useAuthLogin } from '@/shared/hooks/authentication';

export default function ExamplePage() {
  const { mutate: authLogin, isPending } = useAuthLogin();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { email: string; password: string };
    authLogin({email: data.email, password: data.password});
  };

  return (
    <Card className="max-w-[400px] w-[380px] p-2">
      <CardHeader className="flex gap-3">
        <Image
          alt="heroui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">Login to Bash App</p>
          <p className="text-small text-default-500">by budimind.com</p>
        </div>
      </CardHeader>
      <CardBody>
        <Form className="flex flex-col gap-4 mb-8" validationBehavior="aria" onSubmit={onSubmit}>
          <Input
            id="email"
            name="email"
            label="Email"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your email"
            type="email"
          />
          <Input
            id="password"
            name="password"
            label="Password"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your password"
            type={isVisible ? 'text' : 'password'}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
          <Button color="primary" type="submit" isDisabled={isPending} fullWidth>
            Submit
          </Button>
        </Form>
      </CardBody>
      <CardFooter className="flex flex-col gap-2 justify-center items-center">
        <p>Don't have an account? <Link href="/signup">Register here</Link></p>
        <Link href="https://github.com/heroui-inc/heroui">forgot password?</Link>
      </CardFooter>
    </Card>
  );
}
