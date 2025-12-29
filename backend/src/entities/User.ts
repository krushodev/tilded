import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '@/entities/Task';
import { Project } from '@/entities/Project';
import { Category } from '@/entities/Category';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, type: 'varchar' })
  email!: string;

  @Column({ select: false, type: 'varchar' })
  password!: string;

  @Column({ nullable: true, type: 'varchar' })
  name?: string;

  @Column({ nullable: true, type: 'text' })
  avatar?: string;

  @Column({ nullable: true, type: 'varchar', length: 10, default: 'en' })
  language?: string;

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[];

  @OneToMany(() => Project, project => project.user)
  projects!: Project[];

  @OneToMany(() => Category, category => category.user)
  categories!: Category[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
