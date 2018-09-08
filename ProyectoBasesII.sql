use master
go
drop database ProyectoBasesII
go
create database ProyectoBasesII
GO 
use ProyectoBasesII
GO
create table personas
(
    cedula      INT             primary key,
    nombre      varchar(30)     NOT NULL,
    apellido1   varchar(30)     NOT NULL,
    apellido2   varchar(30)     NOT NULL
)
GO
create SCHEMA test

go
create table test.personas2
(
    cedula      INT             primary key,
    nombre      varchar(30)     NOT NULL,
    apellido1   varchar(30)     NOT NULL,
    apellido2   varchar(30)     NOT NULL
)
GO
create view vista_personas 
as 
select * from personas
go
create view test.vista_personas2 
as 
select * from test.personas2
GO
Create Procedure getPK(
	@schema		varchar(30),
	@table		varchar(30),
	@name		varchar(30) output,
	@type		varchar(30) output) 
AS
	
SELECT @name=Col.COLUMN_NAME, @type=Col_type.DATA_TYPE from 
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS Tab, 
    INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE Col,
	INFORMATION_SCHEMA.COLUMNS Col_type
WHERE 
	Tab.TABLE_SCHEMA = @schema
    AND Tab.Table_Name = @table	
	AND Tab.Constraint_Type = 'PRIMARY KEY'

	AND Col.TABLE_SCHEMA = Tab.TABLE_SCHEMA
	AND Col_type.TABLE_SCHEMA = Tab.TABLE_SCHEMA

    AND Col.Table_Name = Tab.Table_Name
	AND Col_type.TABLE_NAME = Tab.TABLE_NAME

	AND Col.COLUMN_NAME = Col_type.COLUMN_NAME 

go

select * from INFORMATION_SCHEMA.COLUMNS

GO
--drop procedure  genera_insertar
--GO
CREATE PROCEDURE genera_insertar 
(
    @prefijo		VARCHAR (30), 
    @nombre_tabla	VARCHAR (50),
    @esquema_t		VARCHAR (30),
    @esquema_p		VARCHAR (30)
)
AS
DECLARE
    @sql Nvarchar (2000),
    @parametros VARCHAR(500),
    @l_columnas VARCHAR(500),
    @l_parametros VARCHAR(500),
    @columna varchar(50),
    @tipo_datos varchar(50),
    @largo varchar(50)
declare c_columnas CURSOR FOR 
    select COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.COLUMNS
    where TABLE_SCHEMA=@esquema_t and TABLE_NAME=LOWER(@nombre_tabla)
BEGIN
    SET @sql='CREATE PROCEDURE '+ @esquema_p+'.'+@prefijo+'_Insert_'+@nombre_tabla
    OPEN c_columnas
    FETCH NEXT FROM c_columnas
	INTO @columna , @tipo_datos, @largo
    SET @parametros='('
    SET @l_columnas='('
    SET @l_parametros='('
	WHILE @@FETCH_STATUS = 0
	BEGIN

        IF @largo IS NULL
        BEGIN
            SET @parametros=@parametros+'@'+@columna+' '+@tipo_datos+', '
        END
        ELSE
        BEGIN
            SET @parametros=@parametros+'@'+@columna+' '+@tipo_datos+'('+@largo+'), '
        END
        SET @l_columnas=@l_columnas+@columna+', '
        SET @l_parametros=@l_parametros+'@'+@columna+', '
        
        FETCH NEXT FROM c_columnas
        INTO @columna , @tipo_datos, @largo
    END
    SET @parametros=SUBSTRING(@parametros,0,LEN(@parametros))+')'
    SET @l_columnas=SUBSTRING(@l_columnas,0,LEN(@l_columnas))+')'
    SET @l_parametros=SUBSTRING(@l_parametros,0,LEN(@l_parametros))+')'
    CLOSE c_columnas
    DEALLOCATE c_columnas;

    set @sql=@sql+@parametros + ' AS BEGIN INSERT INTO '
    set @sql=@sql+@esquema_t+'.'+@nombre_tabla+@l_columnas+' values'+@l_parametros+'; END'

    EXECUTE sp_executesql @sql

    PRINT @sql
END

GO
create procedure genera_delete(
	@prefijo		VARCHAR (30), 
    @nombre_tabla	VARCHAR (50),
	@esquema_t		VARCHAR	(30),
    @esquema_p		VARCHAR (30)
)as 
DECLARE
    @sql		Nvarchar (2000),
	@pk_type	varchar	 (30),
	@pk_name	varchar	 (30)
begin
	IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=@esquema_t and TABLE_NAME=lower(@nombre_tabla))--pregunta si existe la tabla de la operacion en el esquema
		begin
			exec getPK @esquema_t,@nombre_tabla,@pk_name output,@pk_type output
			--print(@pk_type)
			IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = @esquema_p)
				set @esquema_p='dbo'--aqui el schema va a cambiar cuando lo manda vacio desde el front end queriendo decir q lo quiere en el default
			SET @sql='CREATE PROCEDURE '+ @esquema_p+'.'+@prefijo+'_Delete_'+@nombre_tabla+'(@pk '+@pk_type+') 
			as 
			BEGIN 
				DELETE FROM '+ @esquema_t+'.'+@nombre_tabla+' where '+@pk_name+'=@pk;
			END;'
			EXECUTE sp_executesql @sql
			print @sql
		end
	else
		print 'La tabla '+@nombre_tabla+' a la que quiere crear el delete no existe en el esquema '+@esquema_t
end;
go
create procedure genera_select (
	@prefijo		VARCHAR (30), 
    @nombre_tabla	VARCHAR (50),
	@esquema_t		VARCHAR	(30),
    @esquema_p		VARCHAR (30)
)as 
DECLARE
    @sql			Nvarchar (2000),
    @parametros		VARCHAR(500),
	@where			VARCHAR(500),
    @columna		varchar(50),
    @tipo_datos		varchar(50),
    @largo			varchar(50)
declare c_columnas CURSOR FOR 
    select COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.COLUMNS
    where TABLE_SCHEMA=@esquema_t and TABLE_NAME=LOWER(@nombre_tabla)
begin
	IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=@esquema_t and TABLE_NAME=lower(@nombre_tabla))--pregunta si existe la tabla de la operacion en el esquema
		begin
			IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = @esquema_p)
				set @esquema_p='dbo'--aqui el schema va a cambiar cuando lo manda vacio desde el front end queriendo decir q lo quiere en el default
			SET @sql='CREATE PROCEDURE '+ @esquema_p+'.'+@prefijo+'_Select_'+@nombre_tabla
			OPEN c_columnas
			FETCH NEXT FROM c_columnas
			INTO @columna , @tipo_datos, @largo
			SET @parametros='('
			SET @where = ' where
					'
			WHILE @@FETCH_STATUS = 0
			BEGIN

				IF @largo IS NULL
					BEGIN
						SET @parametros=@parametros+'@'+@columna+' '+@tipo_datos+', '
					END
				ELSE
					BEGIN
						SET @parametros=@parametros+'@'+@columna+' '+@tipo_datos+'('+@largo+'), '
					END
				set @where = @where+'((@'+@columna+' is NULL) or ('+@columna+'=@'+@columna+'))
					and '
        
				FETCH NEXT FROM c_columnas
				INTO @columna , @tipo_datos, @largo
			END
			SET @parametros=SUBSTRING(@parametros,0,LEN(@parametros))+')'
			SET @where=SUBSTRING(@where,0,LEN(@where)-10)+')'
			CLOSE c_columnas
			DEALLOCATE c_columnas;

			set @sql=@sql+@parametros + '
			AS 
			BEGIN 
				Select * from '
			set @sql=@sql+@esquema_t+'.'+@nombre_tabla+@where+'; 
			END'
			EXECUTE sp_executesql @sql
			print @sql
		end
	else
		print 'La tabla '+@nombre_tabla+' a la que quiere crear el delete no existe en el esquema '+@esquema_t
end
go

create procedure genera_update (
	@prefijo		VARCHAR (30), 
    @nombre_tabla	VARCHAR (50),
	@esquema_t		VARCHAR	(30),
    @esquema_p		VARCHAR (30)
)as 
DECLARE
    @sql			Nvarchar (2000),
    @parametros		VARCHAR(500),
	@update			VARCHAR(500),
    @columna		varchar(50),
    @tipo_datos		varchar(50),
    @largo			varchar(50),
	@pk_name		varchar(30),
	@pk_type		varchar(30)
declare c_columnas CURSOR FOR 
    select COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.COLUMNS
    where TABLE_SCHEMA=@esquema_t and TABLE_NAME=LOWER(@nombre_tabla)
begin
	IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=@esquema_t and TABLE_NAME=lower(@nombre_tabla))--pregunta si existe la tabla de la operacion en el esquema
		begin
			exec getPK @esquema_t,@nombre_tabla,@pk_name output,@pk_type output
			IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = @esquema_p)
				set @esquema_p='dbo'--aqui el schema va a cambiar cuando lo manda vacio desde el front end queriendo decir q lo quiere en el default
			SET @sql='CREATE PROCEDURE '+ @esquema_p+'.'+@prefijo+'_Update_'+@nombre_tabla
			OPEN c_columnas
			FETCH NEXT FROM c_columnas
			INTO @columna , @tipo_datos, @largo
			SET @parametros='(@pk_'+@pk_name+' '+@pk_type+', '
			SET @update = ' Set
					'
			WHILE @@FETCH_STATUS = 0
			BEGIN

				IF @largo IS NULL
					BEGIN
						SET @parametros=@parametros+'@'+@columna+' '+@tipo_datos+', '
					END
				ELSE
					BEGIN
						SET @parametros=@parametros+'@'+@columna+' '+@tipo_datos+'('+@largo+'), '
					END
				set @update = @update+@columna+'=@'+@columna+',
					'
        
				FETCH NEXT FROM c_columnas
				INTO @columna , @tipo_datos, @largo
			END
			SET @parametros=SUBSTRING(@parametros,0,LEN(@parametros))+')'
			SET @update=SUBSTRING(@update,0,LEN(@update)-7)+' 
				where '+@pk_name+'=@pk_'+@pk_name
			CLOSE c_columnas
			DEALLOCATE c_columnas;

			set @sql=@sql+@parametros + '
			AS 
			BEGIN 
				Update '
			set @sql=@sql+@esquema_t+'.'+@nombre_tabla+@update+'; 
			END'
			EXECUTE sp_executesql @sql
			print @sql
		end
	else
		print 'La tabla '+@nombre_tabla+' a la que quiere crear el delete no existe en el esquema '+@esquema_t
end
go

create schema autogeneracion
GO

EXECUTE genera_insertar 'GA','Personas2','test','autogeneracion'
EXECUTE genera_delete 'GA','Personas2','test','autogeneracion'
EXECUTE genera_select 'GA','Personas2','test','autogeneracion'
EXECUTE genera_update 'GA','Personas2','test','autogeneracion'

--correr hasta aqu� y despu�s ir linea por linea ejecutando las de abajo
EXEC autogeneracion.GA_Insert_Personas2 207730941,'Marco','Esquivel','Vargas'
go

execute autogeneracion.GA_Insert_Personas2 123456789,'Wilfred','Alvarado','Gay'
go

execute autogeneracion.GA_Delete_Personas2 207730941
go

execute autogeneracion.GA_Select_Personas2 207730941,null,null,null
go

execute autogeneracion.GA_Select_Personas2 null,'Marco2',null,null
go

select * from test.personas2

execute autogeneracion.GA_Update_Personas2 207730941,207730941,'Marco2','Esquivel2','Vargas2'
go

select * from INFORMATION_SCHEMA.TABLE_CONSTRAINTS