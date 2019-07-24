SET GLOBAL event_scheduler = ON;

create event shelftime
    on schedule
    every 1 second
    do 
    update items set shelf_time = shelf_time-1 where item_id >=1 and shelf_time >0;
    