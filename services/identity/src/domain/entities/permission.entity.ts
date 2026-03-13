export interface PermissionDomainProps {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export class PermissionDomainEntity {
  readonly id: string;
  readonly name: string;
  readonly resource: string;
  readonly action: string;
  readonly description: string;

  constructor(props: PermissionDomainProps) {
    this.id = props.id;
    this.name = props.name;
    this.resource = props.resource;
    this.action = props.action;
    this.description = props.description;
  }
}
