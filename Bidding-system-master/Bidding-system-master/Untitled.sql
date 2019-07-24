select u.user_id userid, u.email to_eamil , t.trans_id, i.item_desc
 from bids b, users u , transactions t, items i
 where u.user_id = b.user_id
 and t.bid_id = b.bid_id and t.item_id = b.item_id and i.item_id =b.item_id
  and b.bid_id= 5 and b.item_id =4;
  
  
  select * from bids where item_id =3;
  select * from items;
  select item _id ,bid_id, bid_amount from bids group by item_id ;
  
  
  select  i.item_id, i.item_desc , i.shelf_time, b.bid_amount , i.init_bid , i.status, b.bid_id from 
  items i left join  bids b on  (b.item_id, b.bid_amount) in (
  select  item_id ,max(bid_amount) from bids group by item_id)
  where i.item_id  = b.item_id and i.status= "available";
  
  select  i.item_id, i.item_desc , i.shelf_time, b.bid_amount , i.init_bid , i.status from
  items i left join  bids b  on b.item_id= i.item_id where i.status ="available" ;
  
  
  select u.user_id userid, u.email to_eamil , t.trans_id transid, i.item_desc description
  from bids b, users u , transactions t , items i where u.user_id = b.user_id and t.bid_id = b.bid_id 
  and t.item_id = b.item_id and i.item_id = b.item_id;
  

select * from items i , bids b
where i.item_id = b.item_id and b.bid_id in (
select bid_id from bids where bid_amount 
);


select * from bids;

select * from items i left join  bids b on  
i.item_id = b.item_id and  b.bid_id = (select max(bid_amount) from bids group by item_id) 
where i.status = 'available' ;

select i.item_id, i.item_desc, if(b.bid_amount > init_bid ,b.bid_amount, i.init_bid) as bid_amount,i.shelf_time from items i left join  bids b on i.item_id = b.item_id and  b.bid_id = (select max(bid_amount)
 from bids group by item_id) where i.status = 'available' ;
 
 
 
 SELECT item_id,  MAX(init_bid) as init_bid 
FROM
(
    SELECT item_id, init_bid , item_desc
    FROM items
    UNION ALL
    SELECT b.item_id, b.bid_amount as init_bid , item_desc
    FROM bids b, items i where b.item_id = b.item_id
) as subQuery
GROUP BY item_id 
ORDER BY item_id ;



select  i.item_id, i.item_desc , i.shelf_time, b.bid_amount , i.init_bid , i.status, b.bid_id 
from items i left join  bids b on  (b.item_id, b.bid_amount) in ( select  item_id ,max(bid_amount) from 
bids group by item_id) where i.item_id  = b.item_id and i.status= 'available';


select u.user_id, u.email from bids b, users u 
 where item_id =4 and u.user_id = b.user_id 
 order by b.bid_amount desc limit 1;
 
 select * from bids b , items i where i.item_id= b.item_id  and i.user_id =2;
 
 
 select * from items;
 select * from bids where item_id in (1,2,3) ;