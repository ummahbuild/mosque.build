"""Independent IFC check: pip install ifcopenshell in an isolated environment first."""
import pathlib
import sys
import ifcopenshell
import ifcopenshell.geom
import ifcopenshell.validate

for path in sorted(pathlib.Path(sys.argv[1]).glob("*.ifc")):
    model = ifcopenshell.open(str(path))
    logger = ifcopenshell.validate.json_logger()
    ifcopenshell.validate.validate(model, logger, express_rules=True)
    assert not logger.statements, (path.name, logger.statements)
    settings = ifcopenshell.geom.settings()
    count = 0
    for element in model.by_type("IfcElement"):
        shape = ifcopenshell.geom.create_shape(settings, element)
        assert len(shape.geometry.verts) > 0, (path.name, element.Name)
        assert len(shape.geometry.faces) > 0, (path.name, element.Name)
        count += 1
    assert count > 10, path.name
    assert len(model.by_type("IfcProject")) == 1
    assert len(model.by_type("IfcBuildingStorey")) == 1
    print(f"PASS {path.name}: schema, EXPRESS rules, {count} tessellated elements")
