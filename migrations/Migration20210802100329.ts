import { Migration } from '@mikro-orm/migrations';

export class Migration20210802100329 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `rental` (`id` varchar(255) not null, `movie_id` varchar(255) not null, `user_id` varchar(255) not null, `date_of_rental` varchar(255) not null, `available_rent` tinyint(1) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `rental` add primary key `rental_pkey`(`id`);');
    this.addSql('alter table `rental` add index `rental_movie_id_index`(`movie_id`);');
    this.addSql('alter table `rental` add index `rental_user_id_index`(`user_id`);');

    this.addSql('alter table `rental` add constraint `rental_movie_id_foreign` foreign key (`movie_id`) references `movie` (`id`) on update cascade;');
    this.addSql('alter table `rental` add constraint `rental_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
  }

}
