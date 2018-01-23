package application;

import api.S2Rest;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Created by rados on 1/22/2018.
 */

@SpringBootApplication
@ComponentScan(basePackageClasses = S2Rest.class)
public class Starter {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Starter.class, args);
    }

}
