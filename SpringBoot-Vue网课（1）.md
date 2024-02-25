abbrlink: 56086
title: SpringBoot+Vue网课（1）
categories:
  - 其他笔记
---
https://www.bilibili.com/video/BV1nV4y1s7ZN

- 后端：Java EE：SpringBoot + MyBatisPlus

- 前端：Vue + ElementUI

- 前后端分离开发

- 公共云部署


### Web技术（架构）

BS：浏览器/服务器（总拥有成本低）

CS：客户端/服务器（交互性强：本地资源、响应速度（胖客户端），需要不同系统不同版本）

### Maven

项目管理工具：自动化的构建、依赖管理、统一开发结构

核心配置文件pom.xml

仓库位置在maven的settings.xml和idea中都可以改

### 状态码

- 1：信息
- 2：成功
- 3：重定向，必须执行一些其他操作以访问
- 4：客户端错误
- 5：服务端错误

### Spring Boot

基于Spring的全新框架

Java EE的三种框架（“SSM”）：Spring、SpringMVC、MyBatis

- 约定优于配置
- 内嵌Tomcat、Jetty（Web）服务器，不需要自己打包war（Tomcat需要war包运行）
- 内置启动器
- 纯java配置，没有代码生成，不需要XML
- 提供生产级服务监控方案

开发深入、复杂的项目还需要研究Spring

**依赖：Spring Web**

#### 项目

pom.xml

application.properties

static：静态资源，templates：模板，本课程用vue做前端

默认运行在8080

#### 热部署：spring-boot-devtools组件

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-devtools</artifactId>
   <optional>true</optional>
</dependency>
```

```properties
spring.devtools.restart.enabled=true
spring.devtools.restart.additional-paths=src/main/java
```

#### Spring Web

spring-boot-starter-web组件：web、webmvc（基础框架）、json、tomcat

MVC模式：Model（接受和响应信息）、Controller（接受和返回请求）、View

#### Controller

- 类映射
  - @Controller 返回的数据必须是视图，返回跳转页面（前后端不分离）
  - @RestController 返回的数据是字符串、对象（自动转为JSON）
- 路径映射
  - @RequestMapping
    - value：支持通配符?：字，\*：词，\*\*：路径
    - method
    - consumes：参数类型，Content-Type
    - produces：响应类型
    - params, headers：规定参数和头的值
  - @GetMapping
    - 405Method not Allowed
- 参数传递
  - 参数名保持一致时不需要注解
    - 封装对象（实体 Entity），必须要加无参构造函数
  - **@RequestParam**("xxx")，用注解的情况下必须传递才能执行方法，否则返回400Bad Request
  - JSON类型要加**@RequestBody**注解，x-www不用
  - 动态路径{}、**@PathVariable**
- HttpServletRequest
  - 得到服务器路径：.getServletContext()

#### 静态资源

可选配置：

```properties
spring.mvc.static-path-pattern=/static/**
spring.web.resources.static-locations=classpath:/static
#过滤规则（虚拟访问路径）（默认/**）
#存放位置（默认classpath:/static；,隔开；默认在服务器路径，target路径则需添加classpath:）
```

#### 文件上传

编码类型multipart/form-data

```properties
spring.servlet.multipart.max-file-size=1MB
spring.servlet.multipart.max-request-size=10MB
#默认值
```

超出限制返回500Internal Server Error

参数类型：MultipartFile，.transferTo(File)可存储到服务器本地

#### 拦截器

- 权限检查
- 性能检测：记录时间
- 通用行为：Cookie、Locale、Theme

extends HandlerInterceptor

重写preHandle（返回boolean是否通过）、postHandle（void返回）、afterCompletion（渲染之后，void返回）方法

#### 注册

@Configuration

implements WebMvcConfigurer

重写addInterceptors方法

拦截器需要注册（一般需要设置路径）：registry.addInterceptor(new xxx()).addPathPatterns("/user/**");

#### 补充：REST

2000年提出的架构原则，符合风格的是RESTful API

- GET、POST、PUT、DELETE
  - 安全性（GET不应该改变服务器资源）、幂等性（多次访问不在影响服务器资源）
  - POST成功返回201Created，资源已存在返回409Conflict
  - PATCH请求：部分更新资源
- 资源表述形式是JSON、HTML
- 请求之间无状态，每个请求都包含必要的信息
- 链接中不出现动词，只用名词，名词往往与表格名对应；用动态路径不用参数
  - get /delUser?id=10
  - -> delete /user/10

#### Swagger

接口文档动态管理、接口调试

##### SpringFox

```xml
<dependency>
   <groupId>io.springfox</groupId>
   <artifactId>springfox-swagger2</artifactId>
   <version>2.9.2</version>
</dependency>
<dependency>
   <groupId>io.springfox</groupId>
   <artifactId>springfox-swagger-ui</artifactId>
   <version>2.9.2</version>
</dependency>
```

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class Swagger2Config {
    private ApiInfo apiInfo(){
        return new ApiInfoBuilder()
                .title("API")
                .description("描述")
                .version("1.0")
                .build();
    }

    @Bean
    public Docket createRestAPI(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage(("net"))) //自动扫描包
                .paths(PathSelectors.any())
                .build();
    }
}
```

如何污染代码：

```java
@ApiOperation(value = "", response = .class)
@ApiResponse(code = 200, message = "success")
```

##### SpringDoc

Spring Boot3以上版本。注释即文档，不污染代码

https://springdoc.org/

```xml
   <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>2.3.0</version>
   </dependency>
```

```java
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openApi(@Value("${spring.application.name}") String applicationName, ObjectProvider<BuildProperties> buildProperties) {
        return new OpenAPI().info(new Info().title(applicationName)
                .description("描述")
                .version("1.0"));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("api")
                .pathsToMatch("/api/**")
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin")
                .pathsToMatch("/admin/**")
                .addOperationCustomizer((operation, handlerMethod) -> {
                    operation.addSecurityItem(new SecurityRequirement().addList(headerName));
                    return operation;
                }) //可选
                .addOpenApiMethodFilter(method -> method.isAnnotationPresent(Admin.class))//可选
                .build();
    }
}

```

If you have **only one** `Docket` — remove it and instead add properties to your `application.properties`:

```properties
springdoc.packagesToScan=package1, package2
springdoc.pathsToMatch=/v1, /api/balance/**
```

### 	MybatisPlus：ORM框架

ORM：对象关系映射：对象 <-> 数据库中记录，自动持久化的

druid：连接池：一次申请多个连接

```xml
<dependency>
   <groupId>com.baomidou</groupId>
   <artifactId>mybatis-plus-boot-starter</artifactId>
   <version>3.4.2</version>
</dependency>
<dependency>
   <groupId>mysql</groupId>
   <artifactId>mysql-connector-java</artifactId>
   <version>5.1.47</version>
</dependency>
<dependency>
   <groupId>com.alibaba</groupId>
   <artifactId>druid-spring-boot-starter</artifactId>
   <version>1.1.20</version>
</dependency>
```

#### Mybatis

放在mapper包中，用接口，加@Xxx("xxx ...") sql语句声明即可，MyBatis自动动态实现类

在启动类中写@MapperScan("xx.mapper")

Controller类#中**@Autowired自动注入实例化后的mapper**

##### 多表查询

外键（注：外键约束 or 手动控制）

在users表中增加orders表的映射

```Java
@TableField(exist = false) //表示不是users表中原有列，避免BaseMapper（MybatisPlus）自动生成
private List<Order> orders;
```

Mapper中

```Java
//UserMapper
@Select("select * from users")
@Results(
        {
                @Result(column = "id", property = "id")
                @Result(column = "id", property = "orders", javaType = List.class,
                       many=@Many(select = "com.xxx.mapper.OrderMapper.selectOrdersById"))
        }
)
List<User> selectAllUserAndOrders();

//OrderMapper
@Select("select * from orders where id = #{id}")
List<Order> selectOrdersById(int id);
```

#### MybatisPlus对单表增删改查增强

接口 extends BaseMapper<类>

**@TableName**声明放在类上，用于类名与表明不同

**@TableId**(type = IdType.AUTO)声明放参数上，表示作为ID且自增，否则即使数据库自增，程序中获取的是0

