import { SlackHook } from '@sorry-cypress/common';
import { InputFieldLabel } from '@src/components';
import { Cell, Tag, TextField } from 'bold-ui';
import React, { ChangeEvent, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface EditBranchFilterProps {
  hook: SlackHook;
  disabled: boolean;
}

export const EditBranchFilter = ({ hook, disabled }: EditBranchFilterProps) => {
  const { errors, setError, clearErrors, control } = useFormContext();
  return (
    <Controller
      control={control}
      name="slackBranchFilter"
      defaultValue={hook.slackBranchFilter}
      render={({ value, onChange }) => (
        <BranchFilter
          hook={hook}
          branches={value}
          disabled={disabled}
          errors={errors}
          setError={setError}
          clearErrors={clearErrors}
          onChange={onChange}
        />
      )}
    />
  );
};

interface BranchFilterProps {
  hook: SlackHook;
  branches: string[];
  disabled: boolean;
  errors: any;
  setError: any;
  clearErrors: any;
  onChange: any;
}

const BranchFilter = ({
  hook,
  branches,
  disabled,
  errors,
  setError,
  clearErrors,
  onChange,
}: BranchFilterProps) => {
  const [inputBranchName, setInputBranchName] = useState('');

  const handleInput = (e: ChangeEvent) => {
    const input = (e.target as HTMLInputElement).value;
    setInputBranchName(input);
    if (input !== '') {
      setError('slackBranchFilter', {
        type: 'custom',
        message:
          'Please submit entered branch name by pressing "Enter" key or clicking "+" button',
      });
    } else {
      clearErrors('slackBranchFilter');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBranch();
    }
  };

  const addBranch = () => {
    if (!inputBranchName) {
      return;
    }

    if (branches?.includes(inputBranchName)) {
      setError('slackBranchFilter', {
        type: 'custom',
        message: 'Entered value already exists!',
      });
      return;
    }

    const newBranchesList = branches?.slice();
    newBranchesList?.push(inputBranchName.trim().toLowerCase());
    onChange(newBranchesList);

    setInputBranchName('');
  };

  const deleteBranch = (name: string) => {
    const newBranchesList = branches?.filter((item) => item !== name);
    onChange(newBranchesList);
  };

  return (
    <Cell xs={12}>
      <InputFieldLabel
        helpText='Filter for branches. You can specify branch names ("master")
          and regular expressions (will be matched as /^YOUR_TEXT$/) which only will trigger a webhook.
          Leaving this control blank activates all the branches.'
        label={<span>Branch Filter</span>}
        htmlFor="slackBranchFilter"
        error={errors['slackBranchFilter']?.message}
      >
        <TextField
          name={'slackBranchFilter'}
          icon={'plus'}
          placeholder="Enter branch name"
          disabled={disabled}
          onChange={handleInput}
          onIconClick={() => addBranch()}
          onKeyDown={handleKeyDown}
          value={inputBranchName}
        />
        <Cell xs={12}>
          {branches &&
            branches.map((branch, index) => (
              <Tag
                key={index}
                onRemove={() => deleteBranch(branch)}
                removable
                type="normal"
                style={{ margin: '3px' }}
              >
                {branch}
              </Tag>
            ))}
        </Cell>
      </InputFieldLabel>
    </Cell>
  );
};
