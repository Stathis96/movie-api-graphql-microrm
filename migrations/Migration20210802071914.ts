import { Migration } from '@mikro-orm/migrations';

export class Migration20210802071914 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `movie` (`id` varchar(255) not null, `title` varchar(255) not null, `genres` text not null, `available` tinyint(1) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `movie` add primary key `movie_pkey`(`id`);');
  }

}
