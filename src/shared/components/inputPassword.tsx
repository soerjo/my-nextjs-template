import { Input, InputProps } from "@heroui/input";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./icon/eyePassword";
import React from "react";

export function InputPassword(props?: InputProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
      <Input
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
        id="password"
        label="Password"
        labelPlacement="outside"
        name="password"
        placeholder="Enter your password"
        type={isVisible ? 'text' : 'password'}
        variant="bordered"
        {...props}
      />
  );
}