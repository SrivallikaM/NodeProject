
--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `USERS` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `password` varchar(32) NOT NULL,
  `salt` varchar(100) ,
  `email` varchar(60) NOT NULL ,
  `first_name` varchar(100) ,
  `last_name` varchar(100) ,
  `date_added` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','suspended') NOT NULL DEFAULT 'suspended',
  `curlogintime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `curloginlocation` varchar(100),
  `lastlogintime` datetime ,
  `lastloginlocation` varchar(100),
  CONSTRAINT PK_USERID PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;


--
-- Table structure for table `sessions`
--
CREATE TABLE IF NOT EXISTS `SESSIONS` (
  `sesskey` int(10) NOT NULL AUTO_INCREMENT,
  `expiry` int(11) NOT NULL DEFAULT '1000000',
  `value` mediumtext,
  `isuser` int(1) NOT NULL  DEFAULT '1',
  `isadmin` int(1) NOT NULL DEFAULT '0',
  `browser` varchar(50) NOT NULL DEFAULT 'Google Chrome',
  `sesskeyapi` varchar(250) NOT NULL ,
  `user_id` int(10) NOT NULL,
  CONSTRAINT PK_SESSIONID PRIMARY KEY (`sesskey`),
  CONSTRAINT FK_USERID FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 DEFAULT COLLATE utf8_general_ci;

--
-- Table structure for table `Items`
-- 
CREATE TABLE IF NOT EXISTS `ITEMS` (
  `item_id` int(10) NOT NULL AUTO_INCREMENT,
  `item_desc` varchar(500) NOT NULL ,
  `user_id` int(10) NOT NULL,
  `init_bid` decimal(6,2) NOT NULL,
  `shelf_time` int(10),
  `notification_status` Varchar(1) NOT NULL DEFAULT 'N',
  `highest_bid` decimal(6,2) ,
  `status` enum('available','soldout') NOT NULL DEFAULT 'available',
  `Rec_mtn_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT PK_itemId PRIMARY KEY (`item_id`),
  CONSTRAINT FK_userid_items FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 DEFAULT COLLATE utf8_general_ci;

--
-- Table structure for table `Bids`
-- 
CREATE TABLE IF NOT EXISTS `BIDS` (
  `bid_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL ,
  `item_id` int(10) NOT NULL,
  `bid_amount` decimal(6,2) NOT NULL,
  `Rec_mtn_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT PK_BIDID PRIMARY KEY (`bid_id`),
  CONSTRAINT FK_userId_bids FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  CONSTRAINT FK_itemid_bid FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 DEFAULT COLLATE utf8_general_ci;


--
-- Table structure for table `Transactions`
-- 
CREATE TABLE IF NOT EXISTS `TRANSACTIONS` (
  `trans_id` int(10) NOT NULL AUTO_INCREMENT,
  `bid_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `trans_value` decimal(6,2) NOT NULL,
  `Rec_mtn_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT PK_transId PRIMARY KEY (`trans_id`),
  CONSTRAINT FK_bidid_trans FOREIGN KEY (`bid_id`) REFERENCES `bids`(`bid_id`) ON DELETE CASCADE,
  CONSTRAINT FK_itmeid_trans FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 DEFAULT COLLATE utf8_general_ci;
