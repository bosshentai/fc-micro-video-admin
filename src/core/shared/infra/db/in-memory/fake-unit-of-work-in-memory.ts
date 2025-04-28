import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import { Transaction } from 'sequelize';

export class UnitOfWorkFakeInMemory implements IUnitOfWork {
  private aggregateRoots: Set<AggregateRoot> = new Set<AggregateRoot>();

  constructor() {}

  async start(): Promise<void> {
    return;
  }
  async commit(): Promise<void> {
    return;
  }
  async rollback(): Promise<void> {
    return;
  }
  getTransaction(): Transaction | null {
    return null;
  }
  do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    return workFn(this);
  }

  addAggregateRoot(aggregateRoot: AggregateRoot): void {
    this.aggregateRoots.add(aggregateRoot);
  }
  getAggregateRoots(): AggregateRoot[] {
    return [...this.aggregateRoots];
  }
}
