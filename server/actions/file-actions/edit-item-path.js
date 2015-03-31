'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');

// Dependencies:
var changecase = require('change-case');
var camel = changecase.camel;
var pascal = changecase.pascal;
var fileStructureUtils = require('../../utils/file-structure');

module.exports = fileStructureUtils.createModifier({
    pre: editItemPath
});

//var transformCreators = {
//    '.component.js': componentTransform,
//    '.feature': featureTransform,
//    '.mock.json': mockDataTransform
//};

function editItemPath (fileStructure, request) {
    var body = request.body;
    var isDirectory = body.isDirectory;
    if (isDirectory && body.oldName && body.newName) {
        // Rename directory
        renameDirectory(fileStructure, request);
    } else if (isDirectory && body.oldDirectoryPath && body.newDirectoryPath) {
        // Move directory
    } else if (!isDirectory && body.oldName && body.newName) {
        // Rename file
        renameFile(fileStructure, request);
    } else if (!isDirectory && body.oldDirectoryPath && body.newDirectoryPath) {
        // Move file
    }
    return fileStructure;

    // var oldName = request.body.oldName || request.body.name;
    // var newName = request.body.newName || request.body.name;
    //
    // var oldDirectoryPath = request.body.oldDirectoryPath || request.body.directoryPath;
    // var newDirectoryPath = request.body.newDirectoryPath || request.body.directoryPath;
    // var oldDirectory = fileStructureUtils.findDirectory(fileStructure, oldDirectoryPath);
    // var newDirectory = fileStructureUtils.findDirectory(fileStructure, newDirectoryPath);
    //
    // if (isDirectory) {
    //     var oldParentDirectory = fileStructure.findDirectory(fileStructure, path.dirname(oldDirectoryPath));
    //     var newParentDirectory = fileStructure.findDirectory(fileStructure, path.dirname(newDirectoryPath));
    //     newParentDirectory.directories = newParentDirectory.directories || [];
    //     newParentDirectory.directories.push(oldDirectory);
    //     _.remove(oldParentDirectory.directories, oldDirectory);
    // } else {
    //     var extension = fileStructureUtils.getExtension(oldDirectoryPath);
    //
    //     oldName += extension;
    //     newName += extension;
    //     var oldPath = path.join(oldDirectoryPath, oldName);
    //     var newPath = path.join(newDirectoryPath, newName);
    //
    //     var file = fileStructureUtils.findFile(oldDirectory, oldPath);
    //     newDirectory.files = newDirectory.files || [];
    //     newDirectory.files.push(file);
    //     _.remove(oldDirectory.files, file);
    // }

    //var transformCreator = transformCreators[extension];
    //if (transformCreator) {
    //    var fileTransforms = transformCreator(fileStructure, oldName, newName, oldPath, newPath);
    //    fileTransforms.forEach(function (fileTransform) {
    //        var file = fileStructureUtils.findFile(fileStructure, fileTransform.path);
    //        fileTransform.transforms.forEach(function (transform) {
    //            var content = file['-content'];
    //            content = content.replace(new RegExp(transform.replace.replace(/\./g, '\\.'), 'g'), transform.with);
    //            file['-content'] = content;
    //        });
    //    });
    //}
    // return fileStructure;
}

function renameDirectory (fileStructure, request) {
    debugger;
    var body = request.body;
    var oldName = body.oldName;
    var newName = body.newName;

    var directoryPath = body.directoryPath;

    var oldPath = path.join(directoryPath, oldName);
    var newPath = path.join(directoryPath, newName);

    var directory = fileStructureUtils.findDirectory(fileStructure, oldPath);
    directory.name = newName;
    directory.path = newPath;
    deletePaths(directory);
}

function renameFile (fileStructure, request) {
    debugger;
    var body = request.body;
    var oldName = body.oldName;
    var newName = body.newName;

    var directoryPath = body.directoryPath;
    var extension = fileStructureUtils.getExtension(directoryPath);

    var oldPath = path.join(directoryPath, oldName + extension);
    var newPath = path.join(directoryPath, newName + extension);

    var directory = fileStructureUtils.findDirectory(fileStructure, directoryPath);
    var file = fileStructureUtils.findFile(directory, oldPath);
    file.name = newName;
    file.path = newPath;
}

//function componentTransform (fileStructure, oldName, newName, oldComponentPath, newComponentPath) {
//    var nonalphaquote = '([^a-zA-Z0-9\"])';
//    var componentUsages = fileStructure.usages[oldComponentPath] || [];
//    componentUsages.push(oldComponentPath);
//    return componentUsages.map(function (usagePath) {
//        return {
//            path: usagePath,
//            transforms: [{
//                replace: nonalphaquote + pascal(oldName) + nonalphaquote,
//                with: '$1' + pascal(newName) + '$2'
//            }, {
//                replace: nonalphaquote + camel(oldName) + nonalphaquote,
//                with: '$1' + camel(newName) + '$2'
//            }, {
//                replace: '\"' + oldName + '\"',
//                with: '"' + newName + '"'
//            }, {
//                replace: path.relative(path.dirname(usagePath), oldComponentPath),
//                with: path.relative(path.dirname(usagePath), newComponentPath)
//            }]
//        };
//    });
//}

//function featureTransform (oldName, newName) {
//    return Promise.resolve([{
//        replace: '(\\s)' + oldName + '(\\r\\n|\\n)',
//        with: '$1' + newName + '$2'
//    }]);
//}
//
//function mockDataTransform (oldName, newName) {
//    return fileStructureUtils.getFileUsages(config.testDirectory)
//    .then(function () {
//        return [];
//    });
//}

function deletePaths (item) {
    _.each(item.directories, deletePaths)
    _.each(item.files, function (file) {
        delete file.path;
    });
}
