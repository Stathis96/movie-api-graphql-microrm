import { Migration } from '@mikro-orm/migrations';

export class Migration20210802093400 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` varchar(255) not null, `title` varchar(255) not null, `date_of_birth` varchar(255) not null, `date_of_registration` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add primary key `user_pkey`(`id`);');
  }

}
