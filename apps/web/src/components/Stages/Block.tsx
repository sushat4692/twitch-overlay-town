import React, { useMemo } from "react";
import { Container, Sprite } from '@inlet/react-pixi'
import { WindowGap } from "../../const/Window";
import { BlockSize, BlockWidth, BlockHeight } from "../../const/Town";
import { useResidentValue } from "../../state/Resident";

// Images
import GrassImage from '../../assets/Grass.png';
import RoadAll from '../../assets/Road-all.png';
import RoadRight from '../../assets/Road-right.png';
import RoadLeft from '../../assets/Road-left.png';
import RoadTop from '../../assets/Road-top.png';
import RoadBottom from '../../assets/Road-bottom.png';
import RoadCornerRT from '../../assets/Road-corner-rt.png';
import RoadCornerRB from '../../assets/Road-corner-rb.png';
import RoadCornerLT from '../../assets/Road-corner-lt.png';
import RoadCornerLB from '../../assets/Road-corner-lb.png';
import RoadInnerRT from '../../assets/Road-inner-rt.png';
import RoadInnerRB from '../../assets/Road-inner-rb.png';
import RoadInnerLT from '../../assets/Road-inner-lt.png';
import RoadInnerLB from '../../assets/Road-inner-lb.png';

type Props = {
    x: number;
    y: number;
}
export const Block: React.FC<Props> = ({x, y}) => {
    const residents = useResidentValue();

    const imageWidth = useMemo(() => {
        return BlockSize * BlockWidth;
    }, [])
    const imageHeight = useMemo(() => {
        return BlockSize * BlockHeight;
    }, [])

    const hasBuilding = useMemo(() => {
        return residents.some(resident => resident.building_x === x && resident.building_y === y);
    }, [residents]);

    const hasRight = useMemo(() => {
        if (hasBuilding) {
            return false;
        }

        return residents.some(resident => resident.building_x === x + BlockWidth && resident.building_y === y);
    }, [hasBuilding, residents])

    const hasLeft = useMemo(() => {
        if (hasBuilding) {
            return false;
        }

        return residents.some(resident => resident.building_x === x - BlockWidth && resident.building_y === y);
    }, [hasBuilding, residents])

    const hasBottom = useMemo(() => {
        if (hasBuilding) {
            return false;
        }

        return residents.some(resident => resident.building_x === x && resident.building_y - BlockHeight === y);
    }, [hasBuilding, residents])

    const hasTop = useMemo(() => {
        if (hasBuilding) {
            return false;
        }

        return residents.some(resident => resident.building_x === x && resident.building_y + BlockHeight === y);
    }, [hasBuilding, residents])

    const hasCornerRT = useMemo(() => {
        if (hasBuilding || hasRight || hasTop) {
            return false;
        }

        return residents.some(resident => resident.building_x - BlockWidth === x && resident.building_y + BlockHeight === y);
    }, [hasBuilding, hasRight, hasTop, residents]);

    const hasCornerRB = useMemo(() => {
        if (hasBuilding || hasRight || hasBottom) {
            return false;
        }

        return residents.some(resident => resident.building_x - BlockWidth === x && resident.building_y - BlockHeight === y);
    }, [hasBuilding, hasRight, hasBottom, residents]);

    const hasCornerLT = useMemo(() => {
        if (hasBuilding || hasLeft || hasTop) {
            return false;
        }

        return residents.some(resident => resident.building_x + BlockWidth === x && resident.building_y + BlockHeight === y);
    }, [hasBuilding, hasLeft, hasTop, residents]);

    const hasCornerLB = useMemo(() => {
        if (hasBuilding || hasLeft || hasBottom) {
            return false;
        }

        return residents.some(resident => resident.building_x + BlockWidth === x && resident.building_y - BlockHeight === y);
    }, [hasBuilding, hasLeft, hasBottom, residents]);

    return (
        <Container
            x={WindowGap + BlockSize * x}
            y={WindowGap + BlockSize * y}
            width={imageWidth}
            height={BlockSize * BlockHeight}
        >
            <Sprite image={GrassImage} x={0} y={0} width={imageWidth} height={imageHeight} />
            {hasBuilding && <Sprite image={RoadAll} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasRight && <Sprite image={RoadRight} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasLeft && <Sprite image={RoadLeft} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasBottom && <Sprite image={RoadBottom} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasTop && <Sprite image={RoadTop} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasCornerRT && <Sprite image={RoadCornerRT} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasCornerRB && <Sprite image={RoadCornerRB} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasCornerLT && <Sprite image={RoadCornerLT} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasCornerLB && <Sprite image={RoadCornerLB} x={0} y={0} width={imageWidth} height={imageHeight} />}

            {hasRight && hasTop && <Sprite image={RoadInnerRT} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasRight && hasBottom && <Sprite image={RoadInnerRB} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasLeft && hasTop && <Sprite image={RoadInnerLT} x={0} y={0} width={imageWidth} height={imageHeight} />}
            {hasLeft && hasBottom && <Sprite image={RoadInnerLB} x={0} y={0} width={imageWidth} height={imageHeight} />}
        </Container>
    );
}