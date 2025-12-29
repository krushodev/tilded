import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, JoinTable } from 'typeorm';
import { User } from '@/entities/User';
import { Project } from '@/entities/Project';
import { Tag } from '@/entities/Tag';
import { Section } from '@/entities/Section';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string;

  @Column({ default: false, type: 'boolean' })
  isCompleted!: boolean;

  @Column({ nullable: true, type: 'date' })
  dueDate!: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  priority!: string | null;

  @Column({ nullable: true, type: 'uuid' })
  userId!: string;

  @Column({ nullable: true, type: 'uuid' })
  projectId!: string;

  @Column({ nullable: true, type: 'uuid' })
  sectionId!: string | null;

  @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @ManyToOne(() => Section, section => section.tasks, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'sectionId' })
  section!: Section | null;

  @ManyToMany(() => Tag, tag => tag.tasks, { cascade: false })
  @JoinTable({
    name: 'task_tags',
    joinColumn: { name: 'taskId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' }
  })
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
