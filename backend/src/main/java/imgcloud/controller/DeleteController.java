package imgcloud.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import imgcloud.domain.dto.IdDto;
import imgcloud.service.DeleteFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class DeleteController {

    private final ObjectMapper objectMapper;
    private final DeleteFileService deleteFileService;

    @PostMapping("/delete/thingImages")
    ResponseEntity<String> deleteThingImages(
            @RequestBody IdDto idDto,
            @RequestHeader("userId") Long userId
    ) throws IOException {
        List<Long> id = idDto.getIdList();
        deleteFileService.deleteThingImages(id);
        return ResponseEntity.ok("deleted");
    }

    @PostMapping("/delete/peopleImages")
    ResponseEntity<String> deletePeopleImages(
            @RequestBody IdDto idDto,
            @RequestHeader("userId") Long userId
    ) throws IOException {
        List<Long> id = idDto.getIdList();
        deleteFileService.deletePeopleImages(id);
        return ResponseEntity.ok("deleted");
    }
}
