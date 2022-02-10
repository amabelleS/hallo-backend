IF EXISTS (SELECT name
            FROM ppl_salary
            WHERE name = @name ) 
            UPDATE ppl_salary
            SET job = @job
            WHERE name = @name
ELSE 
	INSERT  INTO ppl_salary( name, job, salary )
	VALUES  ( @name, @job, @salary )

//
    Create proc ProcedureName(@name NVarchar(50), @job NVarchar(50), @salary int)
as
 
IF EXISTS (SELECT * from ppl_salary where name =@name )
        BEGIN
           Update ppl_salary Set job=@job, salary=@salary where name =@name
        END
    ELSE
        BEGIN
           insert into ppl_salary(Name, job, salary) 
 values(@name,@job,@salary)
        END